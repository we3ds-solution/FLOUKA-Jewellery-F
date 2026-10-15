import visa from 'payment-icons/min/single/visa.svg'
import mastercard from 'payment-icons/min/single/mastercard.svg'
import discover from 'payment-icons/min/single/discover.svg'
import paypal from 'payment-icons/min/single/paypal.svg'

const marks = [
  { name: 'Visa', image: visa },
  { name: 'Mastercard', image: mastercard },
  { name: 'Discover', image: discover },
  { name: 'PayPal', image: paypal },
]

export function PaymentMarks() {
  return (
    <ul className="footer-payments" aria-label="Payment methods">
      {marks.map(mark => (
        <li className="footer-payment-chip" key={mark.name} title={mark.name}>
          <img src={mark.image} width={44} height={28} alt={mark.name} />
        </li>
      ))}
    </ul>
  )
}