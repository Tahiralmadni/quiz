import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const History = () => {
	const navigate = useNavigate();

	useEffect(() => {
		navigate('/scoreboard');
	}, [navigate]);

	return null;
};

export default History;