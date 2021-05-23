import React from "react";
import { Card, Typography } from "antd";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";

import "./categoryItem.css";
const { Title } = Typography;

const CategoryItem = (category) => {
  const item = category.category;

  const handleClick = (e) => {
    e.item = item;
    console.log(e.item);
  };

  return (
    <div className="category-item">
      <Card
        hoverable
        className="card"
        cover={<img className="card-image" alt="" src={item.urlImagen} />}
        onClick={(i) => handleClick(i)}
      ></Card>
      <div className="card-buttons">
        <EditTwoTone
          twoToneColor="black"
          className="dynamic-edit-button"
          onClick={() => console.log("handle edit")}
        />
        <DeleteTwoTone
          twoToneColor="black"
          className="dynamic-edit-button"
          onClick={() => console.log("handle delete")}
        />
      </div>

      <Title className="card-title" level={5}>
        {item.nombre}
      </Title>
      <div className="card-description">{item.descripcion}</div>
    </div>
  );
};

export default CategoryItem;
