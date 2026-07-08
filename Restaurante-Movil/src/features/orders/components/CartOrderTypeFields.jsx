import { Input, Selector } from '../../../shared/components';
import { ORDER_TYPES } from '../../../shared/constants';

// Pedir desde el móvil: para llevar o a domicilio (comer en el restaurante lo
// gestiona el mesero con una mesa asignada).
const CART_ORDER_TYPES = [
  { value: ORDER_TYPES.PARA_LLEVAR, label: 'Para llevar' },
  { value: ORDER_TYPES.A_DOMICILIO, label: 'A domicilio' },
];

// Selector de tipo de pedido + dirección de entrega (condicionada) + cupón.
export function CartOrderTypeFields({ orderType, onChangeOrderType, deliveryAddress, onChangeDeliveryAddress, coupon, onChangeCoupon }) {
  return (
    <>
      <Selector label="Tipo de pedido" options={CART_ORDER_TYPES} value={orderType} onChange={onChangeOrderType} />

      {orderType === ORDER_TYPES.A_DOMICILIO ? (
        <Input
          label="Dirección de entrega"
          leftIcon="location-on"
          placeholder="Calle, número, referencias"
          value={deliveryAddress}
          onChangeText={onChangeDeliveryAddress}
          multiline
        />
      ) : null}

      <Input
        label="Cupón (opcional)"
        leftIcon="local-offer"
        autoCapitalize="characters"
        placeholder="CÓDIGO"
        value={coupon}
        onChangeText={onChangeCoupon}
      />
    </>
  );
}
