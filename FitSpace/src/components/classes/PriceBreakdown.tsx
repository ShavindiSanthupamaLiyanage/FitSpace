import { calculateBookingTotals } from '../../utils/bookingPricing';
import { formatPrice } from '../../utils/formatters';
import '../../styles/class-details.css';

interface PriceBreakdownProps {
  pricePerSpot: number;
  spots: number;
}

function PriceBreakdown({ pricePerSpot, spots }: PriceBreakdownProps) {
  const { classFee, serviceFee, total } = calculateBookingTotals(pricePerSpot, spots);
  const classFeeLabel =
    spots > 1 ? `Class Fee (${spots} × ${formatPrice(pricePerSpot, true)})` : 'Class Fee';

  return (
    <dl className="price-breakdown">
      <div className="price-row">
        <dt>{classFeeLabel}</dt>
        <dd>{formatPrice(classFee, true)}</dd>
      </div>
      <div className="price-row">
        <dt>Service Fee</dt>
        <dd>{formatPrice(serviceFee, true)}</dd>
      </div>
      <div className="price-row price-row-total">
        <dt>Total</dt>
        <dd>{formatPrice(total, true)}</dd>
      </div>
    </dl>
  );
}

export default PriceBreakdown;