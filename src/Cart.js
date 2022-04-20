import { useState } from 'react';
import { Table, Button, Alert, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import './style.scss';


function Cart() {
  let itemsInCart = useSelector((state) => state.reducerOfCart);
  let dispatch = useDispatch();

  let [IsVisibleOfAlert, setIsVisibleOfAlert] = useState(true);

  const increaseQuantity = (index) => dispatch({ type: '수량 증가', payload: { index: index } });

  const decreaseQuantity = (index) => dispatch({ type: '수량 감소', payload: { index: index } });

  const closeAlert = () => setIsVisibleOfAlert(false);

  return (
    <Container>
      <Table responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>상품명</th>
            <th>수량</th>
            <th>변경</th>
          </tr>
        </thead>
        <tbody>
          {
            itemsInCart.map((item, index) => {
              return (
                <tr key={ item.id }>
                  <td>{ index + 1 }</td>
                  <td>{ item.name }</td>
                  <td>{ item.quan }</td>
                  <td>
                    <Button variant="outline-success" onClick={() => increaseQuantity(index)}>+</Button>
                    &nbsp;
                    <Button variant="outline-danger" onClick={() => decreaseQuantity(index)}>-</Button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>

      {
        IsVisibleOfAlert
        ? (
          <Alert variant="warning" onClose={closeAlert} dismissible>
            <Alert.Heading>할인 기회!</Alert.Heading>
            <p>
              지금 구매하시면 20% 할인!
            </p>
          </Alert>
        )
        : null
      }
    </Container>
  )
}

export default Cart;