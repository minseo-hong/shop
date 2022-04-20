/* eslint-disable */
import { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Container, Nav, Alert, Button } from 'react-bootstrap';
import { CSSTransition } from "react-transition-group";
import styled from 'styled-components';
import axios from "axios";

import { stockContext } from './App.js';
import './Detail.scss';
import { connect, useSelector, useDispatch } from "react-redux";

let Box = styled.div`
	padding: 20px;
`;

let Title = styled.h4`
	font-size: 25px;
	color: ${ props => props.color }
`;

function Detail(props) {
	let { id } = useParams();
	let history = useHistory();

	let nodeRef = useRef(null);
	
	let stock = useContext(stockContext)

	let [foundedShoes, setFoundedShoes] = useState();
	let [IsDoneAjaxOfShoes, setShoesGETDone] = useState(false);
	let [IsVisibleOfAlert, setIsVisibleOfAlert] = useState(true);

	let [tabIndex, setTabIndex] = useState(0);
	let [tabSwitch, setTabSwitch] = useState(false);

	const foundShoesWithAxios = () => {
		axios.get('https://codingapple1.github.io/shop/data2.json')
		.then((result) => {
			let newArray = [...props.shoes, ...result.data];
			setFoundedShoes(newArray.find((item) => item.id === Number(id)));
			setShoesGETDone(true);
		})
		.catch(() => {
			console.log('실패했어요')
		})
	};

	const addItemAtViewedHistory = () => {
		let viewedHistory = localStorage.getItem('viewedHistory');
		
		if (!viewedHistory) {
			viewedHistory = [];
		} else {
			viewedHistory = JSON.parse(viewedHistory);
		}

		viewedHistory.push(id);
		viewedHistory = new Set(viewedHistory);
		viewedHistory = [...viewedHistory];

		localStorage.setItem('viewedHistory', JSON.stringify(viewedHistory));
	}

	useEffect(() => {
		foundShoesWithAxios();
		addItemAtViewedHistory();
	}, []);

	useEffect(() => {
		let timer = setTimeout(()=> {
			setIsVisibleOfAlert(false);
		}, 3000);
		return () => {
			clearTimeout(timer)
		}
	}, [IsVisibleOfAlert]);

	return (
		<Container>
			<Box>
				<Title className="black">
					Detail
				</Title>
			</Box>

			{/* <Box>
				<Title className="black">
					{ localStorage.getItem('viewedHistory') }
				</Title>
			</Box> */}

			{
				IsVisibleOfAlert
				? (
					<Alert variant="warning">
            <Alert.Heading>재고 부족</Alert.Heading>
            <p>
              곧 재고가 소진됩니다. 구매를 서두르세요.
            </p>
          </Alert>
				)
				: null
			}

			{
				IsDoneAjaxOfShoes
				? (
					<div className="row">
						<div className="col-md-6">
							<img src={`https://codingapple1.github.io/shop/shoes${foundedShoes.id + 1}.jpg`} width="100%" />
						</div>
						<div className="col-md-6 mt-4">
							<h4 className="pt-5">{foundedShoes.title}</h4>
							<p>{foundedShoes.content}</p>
							<p>{foundedShoes.price}원</p>
							<Info stock={stock} />
							<button className="btn btn-primary" onClick={() => {
								props.setStock([9, 10, 12]);
								props.dispatch({ type: '장바구니에 추가', payload: { id: foundedShoes.id, name: foundedShoes.title, quan: 1 } })
								history.push('/cart');
							}}>주문하기</button>
							&nbsp;
							<button className="btn btn-secondary" onClick={() => {
								history.push('/');
							}}>뒤로가기</button>
						</div>
					</div>
				)
				: null
			}

			<Nav className="mt-5" variant="tabs" defaultActiveKey="link-0">
				<Nav.Item>
					<Nav.Link eventKey="link-0" onClick={() => {
						setTabIndex(0);
						setTabSwitch(false);
					}}>0번째</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="link-1" onClick={() => {
						setTabIndex(1);
						setTabSwitch(false);
					}}>1번째</Nav.Link>
				</Nav.Item>
				<Nav.Item>
					<Nav.Link eventKey="link-2" onClick={() => {
						setTabIndex(2);
						setTabSwitch(false);
					}}>2번째</Nav.Link>
				</Nav.Item>
			</Nav>
			
			<CSSTransition nodeRef={nodeRef} in={tabSwitch} classNames="tabAnimation" timeout={500}>
				<Container ref={nodeRef} className="p-3">
					<TabContent tabIndex={tabIndex} setTabSwitch={setTabSwitch} />
				</Container>
			</CSSTransition>

		</Container>
	)
}

function Info(props) {
	return (
		<p>재고 : {props.stock[0]}</p>
	)
}

function TabContent(props) {
	let tabContent = {
		0: <div>0번째 페이지입니다.</div>,
		1: <div>1번째 페이지입니다.</div>,
		2: <div>2번째 페이지입니다.</div>
	}

	useEffect(() => {
		props.setTabSwitch(true);
	})

	return tabContent[props.tabIndex];
}

function mapStateToProps(state) {
  return {
    itemsInCart: state.reducerOfCart
  }
}

export default connect(mapStateToProps)(Detail);