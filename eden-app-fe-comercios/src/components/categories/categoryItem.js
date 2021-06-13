import React, {useState} from "react";
import { Card, Typography, Modal, Button } from "antd";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";

import "./categoryItem.css";
import Warning from "../../images/Warning.gif";
const { Title } = Typography;

const CategoryItem = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const item = props.category.category;
  const showButtons = props.category.showActionButton;

  const handleClick = (e) => {
    let actionItem = {
      action: "show",
      category: item
    }
    e.item = actionItem;
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = (e) => {
    let actionItem = {
      action: "delete",
      category: item
    }

    e.item = actionItem;
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const Delete = () =>{
    showModal();
  }

  const Edit = (e) =>{
    let actionItem = {
      action: "edit",
      category: item,
      random: Math.random()
    }

    e.item = actionItem;
  }

  return (
    <div className="category-item">
      <Card
        hoverable
        className="card"
        cover={<img className="card-image" alt="" src={item.urlImagen} />}
        onClick={(i) => handleClick(i)}
      ></Card>
      <div className={showButtons ? "card-buttons": "card-buttons-hide"}>
        <EditTwoTone
          twoToneColor="black"
          className="dynamic-edit-button"
          onClick={(i) => Edit(i)}
        />
        <DeleteTwoTone
          twoToneColor="black"
          className="dynamic-edit-button"
          onClick={() => Delete()}
        />
      </div>

      <Title className="card-title" level={5}>
        {item.catalogoOrganizacionNombre}
      </Title>
      <div className="card-description">{item.descripcion}</div>

      <Modal
            title=""
            width={"50%"}
            height={"50%"}
            className="custom-modal"
            visible={isModalVisible}
            onOk={(i) => handleOk(i)}
            onCancel={handleCancel}
            closable={true}
            bodyStyle={{ padding: "10px 24px 10px 24px", overflowY: "auto" }}
            footer={null}
          >
            <div className="description-container">
              <div className="photo">
                <img src={Warning} alt="sub assistant" />
              </div>
              <div className="general">
                <p>¿Estás seguro de eliminar esta categoría?</p>
                <Button
                  key="submit"
                  type="primary"
                  onClick={(i) => handleOk(i)}
                  className="button-delete"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </Modal>
    </div>
  );
};

export default CategoryItem;
