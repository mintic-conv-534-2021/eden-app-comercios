import React from "react";
import { Card, Typography } from "antd";
import { Link } from "react-router-dom";

import "./organizationItem.css";
const { Title } = Typography;

const OrganizationItem = (props) => {
  const item = props.organization;

  return (
    <div className="organization-item">
      <Link
        to={{
          pathname: "/organizations/edit",
          state: {props},
        }}
      >
        <Card
          hoverable
          className="card"
          cover={<img className="card-image" alt="" src={item.urlBanner} />}
        ></Card>
        <Title className="card-title" level={5}>
          {item.nombre}
        </Title>
        <div className="card-description">{item.descripcion}</div>
      </Link>
    </div>
  );
};

export default OrganizationItem;
