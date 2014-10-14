package Foswiki::Plugins::NominalPlugin;

use strict;
use warnings;
use Foswiki::Func;
use JSON;

our $VERSION = version->declare("1.0.0");
our $RELEASE = "1.0.0";
our $SHORTDESCRIPTION = 'Nominal/Actual Performance Indicators';
our $NO_PREFS_IN_TOPIC = 1;

sub initPlugin {
  my ( $topic, $web, $user, $installWeb ) = @_;

  my $context = Foswiki::Func::getContext();
  if ( $context->{'preview'} || $context->{'save'}  ) {
    return 1;
  }

  if ( $context->{'edit'} ) {
    my $path = "%PUBURLPATH%/%SYSTEMWEB%/NominalPlugin";
    my $debug = $Foswiki::cfg{Plugins}{NominalPlugin}{Debug} || 0;
    my $suffix = $debug ? '' : '.min';
    my $styles = <<STYLES;
<link rel="stylesheet" type="text/css" href="$path/css/nominal$suffix.css" />
STYLES

    Foswiki::Func::addToZone( 'head', 'NOMINALPLUGIN::STYLES', $styles );
    return 1;
  }

  Foswiki::Func::registerTagHandler( 'NOMINALVIEWMODEL', \&_handleVM );
  Foswiki::Meta::registerMETA( 'NOMINAL', many => 1, require => ['name'] );

  my %getOpts = ( http_allow => 'GET', validate => 0, authenticate => 0 );
  Foswiki::Func::registerRESTHandler( 'get', \&_restGET, %getOpts );
  Foswiki::Func::registerRESTHandler( 'list', \&_restLIST, %getOpts );

  # ToDo. validate -> 1
  my %postOpts = ( http_allow => 'POST', validate => 0, authenticate => 1 );
  Foswiki::Func::registerRESTHandler( 'save', \&_restPOST, %postOpts );
  Foswiki::Func::registerRESTHandler( 'delete', \&_restPOST, %postOpts );

  return 1;
}

sub _restGET {
  my ( $session, $subject, $verb, $response ) = @_;

  my $query = $session->{request};
  my $src = $query->{param}->{source}[0];

  my ($web, $topic) = Foswiki::Func::normalizeWebTopicName( undef, $src );
  my ($meta, $text) = Foswiki::Func::readTopic( $web, $topic );

  my @nmls = $meta->find( 'NOMINAL' );
  my %retval = (status => 'ok', data => \@nmls);
  my $json = encode_json( \%retval );

  return $json;
}

sub _restLIST {
  my ( $session, $subject, $verb, $response ) = @_;
  my $solr = Foswiki::Plugins::SolrPlugin->getSearcher();
  my $query = $Foswiki::cfg{Plugins}{NominalPlugin}{SolrQuery} || 'topic:NML* -topic:*Template -topic:Web* -topic:*Form web:Nominal';
  $query = $solr->entityDecode( $query, 1 );
  
  my %params = ( rows => 9999 );
  my $raw = $solr->solrSearch( $query, \%params )->{raw_response};
  my $content = decode_json( $raw->{_content} );
  
  my $r = $content->{response};
  my $count = $r->{numFound};

  my @list = ();
  for (my $i = 0; $i < $count; $i++) {
    my $hit = $r->{docs}[$i];
    my $wt = $hit->{webtopic};
    my $url = $hit->{url};
    my $title = $hit->{field_Title_s};

    my ($web, $topic) = Foswiki::Func::normalizeWebTopicName( undef, $wt );
    my ($meta, $text) = Foswiki::Func::readTopic( $web, $topic );

    my @nmls = $meta->find( 'NOMINAL' );
    my %item = (data => \@nmls, title => "$title", url => "$url");
    push( @list, \%item );
  }

  my %retval = (status => 'ok', count => $count, data => \@list);
  return encode_json( \%retval );
}

sub _restPOST {
  my ( $session, $subject, $verb, $response ) = @_;
  my $query = $session->{request};
  my $params = $query->{param};

  if ( $verb !~ m/^(save|delete)$/ ) {
    my %retval = (status => 'error', msg => 'invalid endpoint');
    return encode_json( \%retval );
  }

  my $src = $query->{param}->{source}[0] || '';
  my $json = $params->{data}[0] || '';
  unless ( $src && $json ) {
    my %retval = (status => 'error', msg => 'invalid endpoint');
    return encode_json( \%retval );
  }

  my ($web, $topic) = Foswiki::Func::normalizeWebTopicName( undef, $src );
  my ($meta, $text) = Foswiki::Func::readTopic( $web, $topic );
  my $data = decode_json( $json );

  $meta->putKeyed( 'NOMINAL', \%$data ) if $verb eq 'save';
  $meta->remove( 'NOMINAL', $data->{name} ) if $verb eq 'delete';
  $meta->save();

  my %retval = (status => 'ok');
  return encode_json( \%retval );
}

sub _handleVM {
  my( $session, $params, $topic, $web, $topicObject ) = @_;

  my $type = $params->{_DEFAULT} || '';
  my $viewmodel = $type eq 'list' ? 'AllViewModel' : 'NominalViewModel';
  my $yearOffset = $Foswiki::cfg{Plugins}{NominalPlugin}{FiscalYearStart} || '1';
  $yearOffset = 1 if $yearOffset !~ m/^\d+$/;
  $yearOffset = 1 if $yearOffset < 1;
  $yearOffset = 12 if $yearOffset > 12;

  my $debug = $Foswiki::cfg{Plugins}{NominalPlugin}{Debug} || 0;
  my $suffix = $debug ? '' : '.min';

  my $path = "%PUBURLPATH%/%SYSTEMWEB%/NominalPlugin";
  my $styles = <<STYLES;
<link rel="stylesheet" type="text/css" href="$path/css/jqplot$suffix.css" />
<link rel="stylesheet" type="text/css" href="$path/css/nominal$suffix.css" />
STYLES

  my $scripts = <<SCRIPTS;
<!--[if lt IE 9]><script type="text/javascript" src="$path/js/excanvas$suffix.js"></script><![endif]-->
<script type="text/javascript" src="$path/js/jqplot$suffix.js"></script>
<script type="text/javascript" src="$path/js/nominal$suffix.js"></script>
SCRIPTS

  Foswiki::Func::addToZone( 'head', 'NOMINALPLUGIN::STYLES', $styles );
  Foswiki::Func::addToZone( 'script', 'NOMINALPLUGIN::SCRIPTS', $scripts, 'JQUERYPLUGIN::FOSWIKI' );

  my %lang = (
    actual => '%MAKETEXT{"Actual"}%',
    nominal => '%MAKETEXT{"Nominal"}%',
    jan => '%MAKETEXT{"January"}%',
    feb => '%MAKETEXT{"February"}%',
    mar => '%MAKETEXT{"March"}%',
    apr => '%MAKETEXT{"April"}%',
    may => '%MAKETEXT{"May"}%',
    jun => '%MAKETEXT{"June"}%',
    jul => '%MAKETEXT{"July"}%',
    aug => '%MAKETEXT{"August"}%',
    sep => '%MAKETEXT{"September"}%',
    oct => '%MAKETEXT{"October"}%',
    nov => '%MAKETEXT{"November"}%',
    dec => '%MAKETEXT{"December"}%',
  );

  my $lang = join( "\t", %lang );
  $lang =~ s/\\/\\\\/g;
  $lang =~ s/'/\\'/g;

  my $animate = $Foswiki::cfg{Plugins}{NominalPlugin}{AnimatePlots};
  $animate = 1 if ( !defined $animate );
  $animate = $animate ? 'true' : 'false';

  my $script = <<"SCRIPT";
(function(\$) {
  \$(document).ready( function() {
    ko.applyBindings( new $viewmodel( '$web.$topic', $yearOffset, '$lang', $animate ) );
  });
})(jQuery);
SCRIPT

  if ( Foswiki::Func::getContext()->{SafeWikiSignable} ) {
    Foswiki::Plugins::SafeWikiPlugin::Signatures::permitInlineCode( $script );
  }

  return "<literal><script>$script</script></literal>";
}

1;

__END__
Foswiki - The Free and Open Source Wiki, http://foswiki.org/

Author: Sven Meyer <meyer@modell-aachen.de>

Copyright (C) 2008-2014 Foswiki Contributors. Foswiki Contributors
are listed in the AUTHORS file in the root of this distribution.
NOTE: Please extend that file, not this notice.

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version. For
more details read LICENSE in the root of this distribution.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

As per the GPL, removal of this notice is prohibited.
