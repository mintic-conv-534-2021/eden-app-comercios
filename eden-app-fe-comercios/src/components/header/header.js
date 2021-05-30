import React from "react";
import { Typography, Button, Row, Col } from 'antd';

import './header.css';

const { Title } = Typography;

const Header = () => (
    <Row className="header-content">
        <Col flex="auto">
            <Title level={3}>Paseo el Edén - Administración</Title>
        </Col>
        <Col className="login-section" flex="100px">
            <Button className="login-button" htmlType="button">
               Cerrar Sesión
            </Button>
        </Col>
    </Row>
)

export default Header;