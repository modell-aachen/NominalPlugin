package Foswiki::Plugins::NominalPlugin;

use strict;
use warnings;
use Error qw( :try );
use Foswiki::Func;
use Foswiki::Plugins::JQueryPlugin;
use JSON;

our $VERSION = version->declare("1.1");
our $RELEASE = "1.1";
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

  Foswiki::Func::registerTagHandler( 'NOMINALTASKS', \&_handleTasks );
  Foswiki::Func::registerTagHandler( 'NOMINALVIEWMODEL', \&_handleVM );
  Foswiki::Func::registerTagHandler( 'NOMINALFILTER', \&_handleFilter );
  Foswiki::Meta::registerMETA( 'NOMINAL', many => 1, require => ['name'] );

  my %getOpts = ( http_allow => 'GET', validate => 0, authenticate => 1 );
  Foswiki::Func::registerRESTHandler( 'actions', \&_restACTIONS, %getOpts );
  Foswiki::Func::registerRESTHandler( 'get', \&_restGET, %getOpts );
  # Foswiki::Func::registerRESTHandler( 'list', \&_restLIST, %getOpts );

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
  my $cycle = $meta->get( 'FIELD', 'Cycle' );
  my $monthly = 1;
  if ( $cycle && $cycle->{value} ne 'monthly') {
    $monthly = 0;
  }

  my %retval = (status => 'ok', data => \@nmls, monthly => $monthly);
  my $json = to_json( \%retval );

  $response->header( -type => 'application/json' );
  $response->status( 200 );

  return $json;
}

sub _restACTIONS {
  my ( $session, $subject, $verb, $response ) = @_;

  my $query = $session->{request};
  my $src = $query->{param}->{source}[0];

  my ($web, $topic) = Foswiki::Func::normalizeWebTopicName( undef, $src );
  my $newTopic = $topic . "Actions";
  my %retval = (status => 'ok', location => "$web.$newTopic");
  my $json = to_json( \%retval );

  my $exists = Foswiki::Func::topicExists( $web, $newTopic );
  return $json if $exists;

  my $template = <<TEMPLATE;
%META:PREFERENCE{name="VIEW_TEMPLATE" title="VIEW_TEMPLATE" type="Set" value="NominalActionsView"}%
%META:PREFERENCE{name="EDIT_TEMPLATE" title="EDIT_TEMPLATE" type="Set" value="NominalActionsEdit"}%
TEMPLATE

  try {
    my $meta = Foswiki::Meta->new( $session, $web, $newTopic, $template );
    Foswiki::Func::saveTopic( $web, $newTopic, $meta, "" );
    return $json;
  } catch Foswiki::AccessControlException with {
    my $e = shift;
    %retval = (status => 'error', msg => "$e");
    return to_json( \%retval );
  } catch Error::Simple with {
    my $e = shift;
    %retval = (status => 'error', msg => "$e");
    return to_json( \%retval );
  } otherwise {
    %retval = (status => 'error', msg => "Unknown");
    return to_json( \%retval );
  };
}

sub _jsonList {
  my ($session, $web, $topic) = @_;

  my $solr = Foswiki::Plugins::SolrPlugin->getSearcher();
  my $nominalWeb = Foswiki::Func::getPreferencesValue("NOMINALWEB") || "Nominal";
  my $query = $Foswiki::cfg{Plugins}{NominalPlugin}{SolrQuery} || 'topic:NML* -topic:*Template -topic:Web* -topic:*Actions -topic:*Form';

  #MA #7986
  my $pattern = 'web:\s*[A-Za-z0-9]+[^\s]';
  my $mpattern = 'web:\s*%WEB%';
  if ( $query =~ m/($pattern)/ ) {
    # don't replace param web if it's set to anything elese than the default web
    if ( $1 =~ m/Nominal/ ) {
      $query =~ s/$pattern/web:$nominalWeb/;
    }
  } elsif ( $query =~ m/($mpattern)/ ) {
    $query = Foswiki::Func::expandCommonVariables($query, $topic, $web);
  } else {
    $query .= " web:$nominalWeb";
  }

  $query = $solr->entityDecode( $query, 1 );
  my %params = ( rows => 9999 );
  my $raw = $solr->solrSearch( $query, \%params )->{raw_response};
  my $content = from_json( $raw->{_content} );

  my $r = $content->{response};
  my $count = $r->{numFound};

  my @list = ();
  my $skipped = 0;
  my $curUser = Foswiki::Func::getCanonicalUserID( $session->{user} );
  for (my $i = 0; $i < $count; $i++) {
    my $hit = $r->{docs}[$i];

    my $private = $hit->{field_Private_lst};
    if ( defined $private ) {
      my $viewer = $hit->{field_EligibleViewer_lst};

      my @cuids = ();
      foreach (@$viewer) {
        my $cuid = Foswiki::Func::getCanonicalUserID( $_ );
        push( @cuids, $cuid );
      }

      my $isAllowed = grep( /\Q$curUser\E/, @cuids );
      if ( !$isAllowed && !Foswiki::Func::isAnAdmin( $session->{user} ) ) {
        $skipped++;
        next;
      }
    }

    my $wt = $hit->{webtopic};
    my $url = $hit->{url};
    my $cycle = $hit->{field_Cycle_s};
    my $monthly = 1;
    if ( $cycle && $cycle ne 'monthly') {
      $monthly = 0;
    }

    my ($web, $topic) = Foswiki::Func::normalizeWebTopicName( undef, $wt );
    my ($meta, $text) = Foswiki::Func::readTopic( $web, $topic );

    my @nmls = $meta->find( 'NOMINAL' );
    my %item = (
      _data => \@nmls,
      _url => "$url",
      url => "$url",
      _monthly => $monthly,
    );

    while ( my ($k, $v) = each %$hit ) {
      if ( $k =~ m/^field_(\w+)_\w+$/ ) {
        $item{lc($1)} = $v;
      }
    }

    push( @list, \%item );
  }

  my %retval = (status => 'ok', count => $count - $skipped, data => \@list);
  return to_json( \%retval );
}

sub _restPOST {
  my ( $session, $subject, $verb, $response ) = @_;
  my $query = $session->{request};
  my $params = $query->{param};

  if ( $verb !~ m/^(save|delete)$/ ) {
    my %retval = (status => 'error', msg => 'invalid endpoint');
    return to_json( \%retval );
  }

  my $src = $query->{param}->{source}[0] || '';
  my $json = $params->{data}[0] || '';
  unless ( $src && $json ) {
    my %retval = (status => 'error', msg => 'invalid endpoint');
    return to_json( \%retval );
  }

  my ($web, $topic) = Foswiki::Func::normalizeWebTopicName( undef, $src );
  my ($meta, $text) = Foswiki::Func::readTopic( $web, $topic );
  my $data = from_json( $json );

  $meta->putKeyed( 'NOMINAL', \%$data ) if $verb eq 'save';
  $meta->remove( 'NOMINAL', $data->{name} ) if $verb eq 'delete';
  $meta->save();

  my %retval = (status => 'ok');
  return to_json( \%retval );
}

sub _handleTasks {
  my( $session, $params, $topic, $web, $topicObject ) = @_;

  my $enabled = $Foswiki::cfg{Plugins}{NominalPlugin}{EnableTasks} || 0;
  return '' unless $enabled;

  my $link = <<LINK;
<a id="nml-actions" href="#" data-bind="click: nmlActions">%IF{"istopic %TOPIC%Actions" then="%MAKETEXT{"Go to actions"}%" else="%MAKETEXT{"Create actions"}%"}%</a>
LINK

  return $link;
}

sub _handleFilter {
  my( $session, $params, $topic, $web, $topicObject ) = @_;
  my $fieldName = $params->{_DEFAULT} || $params->{field};
  return '' unless $fieldName =~ m/^\w+$/;

  my $formName = $topicObject->getFormName || 'NominalForm';
  my $form = Foswiki::Form->new($session, Foswiki::Func::normalizeWebTopicName($web, $formName) );
  my $fields = $form->getFields;
  my $field = {'name' => undef, 'type' => undef, 'value' => undef};
  foreach my $f (@$fields) {
    if ( $f->{name} eq $fieldName ) {
      $field->{name} = $f->{title} || $f->{name};
      $field->{type} = $f->{type};
      $field->{value} = $f->{value};
      last;
    }
  }

  return '' unless $field->{type};
  my $name = lc($field->{name});

  if ( $field->{type} =~ m/select/i ) {
    my @opts = ();
    my @labels = ();
    my @arr = split(/\s*,\s*/, $field->{value});
    foreach my $a (@arr) {
      if ( $field->{type} =~ m/values/i ) {
        my @pair = split('=', $a);
        push( @opts, pop @pair );
        push( @labels, pop @pair );
      } else {
        push( @opts, $a );
      }
    }

    my @options = ("<option value=\"(all)\">%MAKETEXT{(all)}%</option>");
    if ( scalar @opts eq scalar @labels) {
      for (my $i=0; $i < scalar @opts; $i++) {
        push( @options, "<option value=\"$opts[$i]\">$labels[$i]</option>")
      }
    } else {
      for (my $i=0; $i < scalar @opts; $i++) {
        push( @options, "<option value=\"$opts[$i]\">$opts[$i]</option>")
      }
    }

    my $inner = join("\n", @options);
    my $html = <<HTML;
<select class="filter filter-select" data-name="$name">
  $inner
</select>
HTML

    return $html;
  }

  if ( $field->{type} =~ m/checkbox/i ) {
    my $label;
    my $value;
    if ( $field->{type} =~ m/values/i ) {
      my @pair = split('=', $field->{value});
      $value = pop @pair;
      $label = pop @pair;
    } else {
      $value = $label = $field->{value};
    }

    my $html = <<HTML;
<select class="filter filter-checkbox" data-name="$name">
  <option value="(all)">%MAKETEXT{(all)}%</option>
  <option value="$value">$label</option>
</select>
HTML

    return $html;
  }

  if ( $field->{type} =~ m/text/i || $field->{type} =~ m/editor/i ) {
    my $html = <<HTML;
    <input class="filter filter-text" type="text" data-name="$name">
HTML

    return $html;
  }

  return;
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
<literal><!--[if lt IE 9]><script type="text/javascript" src="$path/js/excanvas$suffix.js"></script><![endif]--></literal>
<script type="text/javascript" src="$path/js/jqplot$suffix.js"></script>
<script type="text/javascript" src="$path/js/nominal$suffix.js"></script>
SCRIPTS

  Foswiki::Plugins::JQueryPlugin::createPlugin('jqp::underscore');
  Foswiki::Func::addToZone( 'head', 'NOMINALPLUGIN::STYLES', $styles );
  Foswiki::Func::addToZone( 'script', 'NOMINALPLUGIN::SCRIPTS', $scripts, 'JQUERYPLUGIN::JQP::UNDERSCORE' );

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
    quarter => '%MAKETEXT{"Quarter"}%'
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

  my $json = _jsonList($session, $web, $topic);
  my $html = <<HTML;
<literal>
<div class="nml-json">$json</div>
<script>$script</script>
</literal>
HTML

  return $html; "";
}

1;

__END__
Foswiki - The Free and Open Source Wiki, http://foswiki.org/

Author: Sven Meyer <meyer@modell-aachen.de>, et al.

Copyright (C) 2014-2015 Modell Aachen GmbH

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version. For
more details read LICENSE in the root of this distribution.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

As per the GPL, removal of this notice is prohibited.
