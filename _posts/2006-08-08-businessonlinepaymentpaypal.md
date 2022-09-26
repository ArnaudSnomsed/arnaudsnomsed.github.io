---
id: 71
title: 'Business::OnlinePayment::PayPal'
date: '2006-08-08T06:30:43+02:00'
author: arnaud.desmons
layout: post
categories:
    - Informatique
    - Perl
---

![](/img/online-payment.png)

Here is a Perl module I wrote providing a Business::OnlinePayment interface for PayPal. It uses Business::PayPal::API for doing PayPal DirectPayments (using credit cards) so it’s transparent for the end-user that will not even now that we use PayPal. It should be used with [Freeside](http://www.sisd.com/freeside/) (Open-source billing software and outsourced billing services for ISPs) but I used it only with the paypal sandbox so it might need some adjustements.

```
package Business::OnlinePayment::PayPal;

use strict;
use warnings;
use Carp;
use Business::OnlinePayment;
use Data::Dumper;
use Business::PayPal::API qw(DirectPayments);

our @ISA = qw(Business::OnlinePayment);
our @EXPORT = qw();
our @EXPORT_OK = qw();
our $VERSION = '0.1';

# Since there's no standard format for expiration dates, we try to do our best
# (copied from Business::OnlinePayment::InternetSecure

sub parse_expdate {
        my ($self, $str) = @_;

        my ($y, $m);
        if ($str =~ /^(\d{4})\W(\d{1,2})$/ ||# YYYY.MM  or  YYYY-M
            $str =~ /^(\d\d)\W(\d)$/ ||# YY/M  or  YY-M
            $str =~ /^(\d\d)[.-](\d\d)$/) {# YY-MM
                ($y, $m) = ($1, $2);
        } elsif ($str =~ /^(\d{1,2})\W(\d{4})$/ ||# MM-YYYY  or  M/YYYY
                 $str =~ /^(\d)\W(\d\d)$/ ||# M/YY  or  M-YY
                 $str =~ /^(\d\d)\/?(\d\d)$/) {# MM/YY  or  MMYY
                ($y, $m) = ($2, $1);
        } else {
                croak "Unable to parse expiration date";
        }

        $y += 2000 if $y content();
        my $pp = new Business::PayPal::API
          ( Username   => $content{login},
            Password   => $content{password},
            Signature  => $self->signature,
           sandbox    => $self->test_transaction());
            );
        my ($y, $m) = $self->parse_expdate($content{expiration});
        warn Dumper \%content;
        my %response = $pp->DoDirectPaymentRequest ( PaymentAction => 'Sale',
                                                     OrderTotal => $content{amount},
                                                     CreditCardType => $content{type},
                                                     CreditCardNumber => $content{card_number},
                                                     ExpMonth => $m,
                                                     ExpYear => $y,
                                                     CVV2 => '123',
                                                     FirstName => $content{first_name},
                                                     LastName => $content{last_name},
                                                     Street1 => $content{address},
                                                     CityName => $content{city},
                                                     StateOrProvince => $content{state},
                                                     PostalCode => $content{zip},
                                                     Country => 'US',
                                                     Payer => $content{email},
                                                     CurrencyID => 'USD',
                                                     IPAddress => '127.0.0.1',
                                                     );
        unless ($response{Ack} ne 'Success' ) {
            for my $error ( @{$response{Errors}} ) {
                warn "Error: " . $error->{LongMessage} . "\n";
            }
        }
        $self->authorization($response{TransactionID});
        $self->is_success(1);
}

1;

__END__


=head1 NAME

  Business::OnlinePayment::PayPal - PayPal backend for Business::OnlinePayment

=head1 SYNOPSIS

  use Business::OnlinePayment;

  my $transaction = new Business::OnlinePayment(PayPal,
                                        signature => 'BiPC9PjkCyDFQXbSkoZ...'
                                );

=cut
```