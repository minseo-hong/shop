/* eslint-disable */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from 'styled-components';
import './Detail.scss';
import { stockContext } from './App.js';


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
	
	let stock = useContext(stockContext)
	let [alertVisiblity, setAlertVisiblity] = useState(true);
	let [foundedShoes, setFoundedShoes] = useState(props.shoes.find((item) => item.id == id));
	let [shoesGETDone, setShoesGETDone] = useState(false);

	useEffect(() => {
		axios.get('https://codingapple1.github.io/shop/data2.json')
		.then((result) => {
			let newArray = [...props.shoes, ...result.data];
			setFoundedShoes(newArray.find((item) => item.id == id));
			setShoesGETDone(true);
		})
		.catch(() => {
			console.log('실패했어요')
		})
	}, []);

	useEffect(() => {
		let timer = setTimeout(()=> {
			setAlertVisiblity(false);
		}, 3000);
		return () => {
			clearTimeout(timer)
		}
	}, [alertVisiblity]);

	return (
		<div className="container">
			<Box>
				<Title className="black">
					Detail
				</Title>
			</Box>

			{
				alertVisiblity
				? (
					<div className="my-alert-warn">
						<p>재고가 얼마 남지 않았습니다</p>
					</div>
				)
				: null
			}

			{
				shoesGETDone
				?
				(
					<div className="row">
						<div className="col-md-6">
							<img src={`https://codingapple1.github.io/shop/shoes${foundedShoes.id + 1}.jpg`} width="100%" />
						</div>
						<div className="col-md-6 mt-4">
							<h4 className="pt-5">{foundedShoes.title}</h4>
							<p>{foundedShoes.content}</p>
							<p>{foundedShoes.price}원</p>
							<Info stock={stock} />
							<button className="btn btn-danger" onClick={() => { props.setStock([9, 10, 12]) }}>주문하기</button>
							&nbsp;
							<button className="btn btn-danger" onClick={() => {
								history.push('/');
							}}>뒤로가기</button>
						</div>
					</div>
				)
				: null
			}

			

		</div>
	)
}

function Info(props) {
	return (
		<p>재고 : {props.stock[0]}</p>
	)
}

export default Detail;