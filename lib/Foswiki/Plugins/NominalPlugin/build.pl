#!/usr/bin/perl -w
use strict;

BEGIN { unshift @INC, split( /:/, $ENV{FOSWIKI_LIBS} ); }

package NominalPluginBuild;

use Foswiki::Contrib::Build;
our @ISA = qw( Foswiki::Contrib::Build );

use File::Copy;
use File::Find;
use File::Spec;

my $plugin = "NominalPlugin";
my @manifest = ();
my $basedir;
my @ignore = (
  'node_modules/',
  '\.bowerrc$',
  '\.cache/',
  '\.git$',
  '\.npm/$',
  '\.changes$',
  'Gruntfile.js$',
  'bower.json$',
  'package.json$',
  'bower_components/',
  "lib/Foswiki/Plugins/$plugin/build.pl",
  "lib/Foswiki/Plugins/$plugin/MANIFEST",
  "pub/System/$plugin/src/"
);

sub new {
  my $class = shift;
  return bless( $class->SUPER::new( $plugin ), $class );
}

sub target_dev {
  my $this = shift;

  $this->_createManifest();
  my $mpath = "$basedir/lib/Foswiki/Plugins/$plugin/MANIFEST";
  my $data = join( "\n", @manifest );
  $this->_writefile( $data, $mpath );
}

sub target_build {
  my $this = shift;

  $this->_installDeps( "dist" );
  $this->_createManifest();

  my $mpath = "$basedir/lib/Foswiki/Plugins/$plugin/MANIFEST";
  my $old = -f $mpath ? _readfile( $mpath ) : undef;
  my $new = join( "\n", @manifest );
  $this->_writefile( $new, $mpath );

  if ( $old ne $new ) {
    print "MANIFEST has changed. Restarting build process.\n";
    exec('perl', __FILE__, @ARGV);
  }
}

sub _installDeps {
  my $this = shift;
  my $type = shift;

  local $| = 1;
  print "Fetching dependencies:\n";
  print $this->sys_action( qw(npm install) ) . "\n";

  print "Updating components:\n";
  print $this->sys_action( qw(bower update) ) . "\n";

  print "Cleaning directories...\n";
  print $this->sys_action( qw(grunt clean) ) . "\n";

  print "Building...\n";
  print $this->sys_action( qw(grunt build), "--target=$type" ) . "\n";
}

sub _createManifest {
  my $this = shift;

  print "Creating MANIFEST file...\n";
  my $opts = { no_chdir => 1, wanted => \&_wanted };
  $basedir = $this->{basedir};
  find( $opts, $basedir );
}

sub _wanted {
  return if -d;

  my $file = $_;
  foreach (@ignore) {
    return if ( $file =~ m#$_# );
  }

  my $relpath = File::Spec->abs2rel( $file, $basedir );
  return if $relpath !~ m#/#;
  push @manifest, "$relpath 0644";
}

sub _readfile {
  my $name = shift;
  open(IN, "<", $name) or die "Can't open `$name' for reading: $!";
  my @data = grep { !/\@Packager\.RemoveLine/ } <IN>;
  close(IN);
  return join('', @data);
}

sub _writefile {
  my $this = shift;
  my $data = shift;
  my $path = shift;

  open( M, ">", $path ) or die "Can't create MANIFEST file: $!";
  print M $data;
  close( M );
}

my ($spec_vol, $spec_path) = File::Spec->splitpath(__FILE__);
my $mani_path = File::Spec->catfile($spec_vol.$spec_path, 'MANIFEST');
if (!-f $mani_path) {
  open(MANI, '>', $mani_path) or die "Cannot create $mani_path: $!";
  close(MANI);
}

package main;
my $build = new NominalPluginBuild();
$build->build( $build->{target} );

