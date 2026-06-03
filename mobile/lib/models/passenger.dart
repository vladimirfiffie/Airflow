/// A traveler on a booking. Mirrors `Passenger` in the web app.
class Passenger {
  Passenger({
    this.firstName = '',
    this.lastName = '',
    this.dob = '',
    this.seatId,
  });

  String firstName;
  String lastName;
  String dob; // ISO yyyy-MM-dd
  String? seatId;

  String get displayName {
    final n = '$firstName $lastName'.trim();
    return n.isEmpty ? 'Passenger' : n;
  }

  Passenger copy() => Passenger(
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        seatId: seatId,
      );
}

class ContactInfo {
  ContactInfo({this.email = '', this.phone = ''});
  String email;
  String phone;
}

class PaymentInfo {
  PaymentInfo({
    this.cardNumber = '',
    this.cardName = '',
    this.expiry = '',
    this.cvv = '',
    this.postalCode = '',
  });
  String cardNumber;
  String cardName;
  String expiry;
  String cvv;
  String postalCode;
}
