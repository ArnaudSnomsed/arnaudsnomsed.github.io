#!/usr/bin/perl

use Getopt::Long;
use Net::IMAP::Simple::SSL;
use OpenCA::OpenSSL;
use OpenCA::X509;

GetOptions(
	   'host=s'	=> \$host,
	   'inbox=s'	=> \$inbox,
	   'user=s'	=> \$user,
	   'passwd=s'	=> \$passwd,
	   'cacert=s'   => \$cacert,	   
	  );

if (!($user && $passwd && $inbox)) {
    print "./mail2shell --host <host> --user <user> --passwd <passwd> --inbox <inbox> --cacert <cacert>\n";
    exit 1;
}

my $imap = new Net::IMAP::Simple::SSL($host) or die;
$imap->login($user, $passwd) or die;
my $nm = $imap->select($inbox) or die;

my $openssl = new OpenCA::OpenSSL();
my $x509    = new OpenCA::X509(
			      INFILE => $cacert,
			      SHELL => $openssl
			     ) or die;

for (my $i = 1; $i <= $nm; $i++) {
    next if $imap->seen($i);
    my $msg = join('', @{$imap->get($i)});;
    my $smime = OpenCA::OpenSSL::SMIME->new(
					    DATA => $msg,
					    SHELL => $openssl,
					    CA_CERTS => [ $x509 ],
					   );
    if ($smime->verify( USES_EMBEDDED_CERT => 1 )) {
	my $parser = new MIME::Parser();
	$parser->output_dir("/tmp");
	my $entity = $parser->parse_data($msg)->parts(0);
	open(BASH, "| /bin/bash");
	if ($entity->is_multipart) {
	    $entity->parts(0)->print_body(\*BASH);
	}
	else {
	    $entity->bodyhandle->print(\*BASH);
	}
	close BASH;
	$entity->purge;
    }
}

$imap->quit;
