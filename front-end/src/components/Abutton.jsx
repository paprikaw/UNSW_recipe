import { PoweroffOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useState } from 'react';

const Abutton = () => {
	const [loadings, setLoadings] = useState([]);

	const enterLoading = (index) => {
		setLoadings((prevLoadings) => {
			const newLoadings = [...prevLoadings];
			newLoadings[index] = true;
			return newLoadings;
		});
		setTimeout(() => {
			setLoadings((prevLoadings) => {
				const newLoadings = [...prevLoadings];
				newLoadings[index] = false;
				return newLoadings;
			});
		}, 500);
	};

	return (
		<>
			<Space
				style={{
					width: '100%',
				}}
			>
				<Button
					className="logout"
					type="primary"
					icon={<PoweroffOutlined />}
					loading={loadings[1]}
					onClick={() => enterLoading(1)}
				>
					Log Out
				</Button>
			</Space>
		</>
	);
};

export default Abutton;