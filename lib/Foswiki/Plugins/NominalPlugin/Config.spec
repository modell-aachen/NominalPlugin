#---+ Extensions
#---++ NominalPlugin

# **BOOLEAN**
# Enable debug output
$Foswiki::cfg{Plugins}{NominalPlugin}{Debug} = 0;

# **BOOLEAN**
# Enable Tasks integration
$Foswiki::cfg{Plugins}{NominalPlugin}{EnableTasks} = 0;

# **STRING**
$Foswiki::cfg{Plugins}{NominalPlugin}{SolrQuery} = 'topic:NML* -topic:*Template -topic:*Form -topic:*Actions -topic:Web*';

# **STRING**
# The starting month of a fiscal year (as integer, 1-12).
$Foswiki::cfg{Plugins}{NominalPlugin}{FiscalYearStart} = '1';

# **BOOLEAN**
# Toggle plot animation. Affects performance
$Foswiki::cfg{Plugins}{NominalPlugin}{AnimatePlots} = 1;
