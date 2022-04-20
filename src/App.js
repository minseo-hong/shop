/* eslint-disable */
import { useContext, useState, createContext, lazy, Suspense } from 'react';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link, Route, Switch } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';

import data from './data.js';

import './App.css';

export let stockContext = createContext();

let Detail = lazy(() => import('./Detail.js'));
let Cart = lazy(() => import('./Cart.js'));

function App() {
  let [shoes, setShoes] = useState(data);
  let [stock, setStock] = useState([10, 11, 12]);

  const getShoesWithAxios = () => {          
    axios.get('https://codingapple1.github.io/shop/data2.json')
    .then((result) => {
      setShoes([...shoes, ...result.data]);
    })
    .catch(() => {
      console.log('실패했어요');
    })
  }

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Shoes Shop</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/detail">Detail</Nav.Link>
              <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

			<Switch>
				<Route exact path="/">
					<div className="jumbotron">
						<h1>20% Season Off</h1>
						<p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
						<p><Button variant="primary">Learn more</Button></p>
					</div>

					<Container>
            <stockContext.Provider value={stock}>
              <div className="row">
                {
                  shoes.map((shoes, index) => <Card shoes={shoes} index={index} key={index}/>)
                }
              </div>
            </stockContext.Provider>

            <Button className="mt-3" onClick={getShoesWithAxios}>더보기</Button>
					</Container>
				</Route>

        <Route exact path="/detail">
          <div>Detail 페이지입니다.</div>
        </Route>

				<Route path="/detail/:id">
          <stockContext.Provider value={stock}>
            <Suspense fallback={<div>로딩중입니다</div>}>
					    <Detail shoes={shoes} setStock={setStock}/>
            </Suspense>
          </stockContext.Provider>
				</Route>

        <Route path="/cart">
          <Suspense fallback={<div>로딩중입니다</div>}>
            <Cart />
          </Suspense>
        </Route>

				<Route path="/:id">
					<div>아무거나 적었을때 이걸 보여줌</div>
				</Route>

			</Switch>
    </div>
  );
}

function Card(props) {
  let stock = useContext(stockContext);
  let history = useHistory();

  return (
    <div className="col-md-4" onClick={() => { history.push(`/detail/${props.shoes.id}`) }}>
      <img src={`https://codingapple1.github.io/shop/shoes${props.shoes.id + 1}.jpg`} width="100%"/>
      <h4>{ props.shoes.title }</h4>
      <p>{ props.shoes.content }</p>
      <p>{ props.shoes.price }원 & { stock[props.index] }켤레</p>
    </div>
  )
}

export default App;
