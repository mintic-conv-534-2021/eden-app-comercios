import React from "react";
import { Row, Col, Button } from 'antd';
import { Link } from "react-router-dom";

//Resources
import home_img from "../../images/home_img.png"
import './home.css';

const Home = () => (
    <div className="home">
        <Row className="main-content">
            <Col span={4} />
            <Col span={8} className="main-description">
                <h1 className="main-title">Bienvenido a Paseo El Edén</h1>
                <span className="main-subtitle">Estas a punto de gestionar la plataforma</span>
                <Row className="main-buttons">
                    <Col>
                    <Link className="categories-button" to="/categories">
                        <Button className="organizations-button"htmlType="button">
                            <span className="button-text">Gestionar Categorias</span><i className="arrow right"></i>
                        </Button>
                    </Link>
                    </Col>
                    <Col>
                        <Link className="organizations-button" to="/organizations">
                            <Button className="organizations-button" htmlType="button">
                                <span className="button-text">Gestionar Organizaciones</span><i className="arrow right"></i>
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Col>
            <Col span={8}>
                <img src={home_img} alt="Home assistant" />
            </Col>
            <Col span={4} />
        </Row>
    </div>
)

export default Home;
