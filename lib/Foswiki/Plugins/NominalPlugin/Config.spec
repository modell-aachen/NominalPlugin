#---+ Extensions
#---++ NominalPlugin

# **BOOLEAN**
# Enable debug output
$Foswiki::cfg{Plugins}{NominalPlugin}{Debug} = 0;

# **STRING**
$Foswiki::cfg{Plugins}{NominalPlugin}{SolrQuery} = 'topic:NML* -topic:*Template -topic:*Form web:Nominal';

# **STRING**
$Foswiki::cfg{Plugins}{NominalPlugin}{FiscalYearStart} = '1';
