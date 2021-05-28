import React, { useEffect, useState } from "react";
import { Typography, Row, Col, Form, Input, Button, Modal } from "antd";
import axios from "axios";
import {
  MinusCircleOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "./addSubCategory.css";

import { API_ADMIN } from "../../context/constants";
import cert_img from "../../images/Certification.gif";

const { Title } = Typography;
const urlGET = API_ADMIN + "catalogo-producto";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

// Saving variables
var payload = {
  catalogoProductoDTOList: [],
};

const catalogProduct = {
  catalogoProductoId: "",
  nombre: "",
  activo: true,
};

const AddSubCategory = (category) => {
  const [setCategory, setSelectedCategory] = useState(category);
  const [subCategory, setSubCategory] = useState("");
  const [initialValues, setInitialValues] = useState("");
  const [displayForm, setDisplayForm] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (category !== setCategory) {
      setSelectedCategory(category);
      setDisplayForm(false);

      // Get SubCategory by Category Id
      axios
        .get(urlGET)
        .then((res) => setSubCategory(res.data.catalogoProductoDTOList));

      var initForm = {
        names: [],
        names2: [],
      };

      if (Object.keys(subCategory).length !== 0) {
        let itemsArr1 = [];
        let itemsArr2 = [];

        let flag = false;
        subCategory.forEach((prod) => {
          //TODO: Validate organization catalog Id
          if (flag) {
            itemsArr2.push(prod.nombre);
            flag = false;
          } else {
            itemsArr1.push(prod.nombre);
            flag = true;
          }
        });

        initForm.names = itemsArr1;
        initForm.names2 = itemsArr2;
      }

      setInitialValues(initForm);
    }
  }, [category, setCategory, subCategory]);

  const createNewCategory = () => {
    setDisplayForm(true);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    console.log("Received values of form:", values);

    let itemsArr = [];
    values.names.forEach((cat) => {
      const custCat = Object.create(catalogProduct);
      custCat.catalogoProductoId =
        setCategory.selectedCategory.catalogoOrganizacionId;
      custCat.nombre = cat;
      custCat.activo = true;
      itemsArr.push(custCat);
    });

    values.names2.forEach((cat) => {
      const custCat = Object.create(catalogProduct);
      custCat.catalogoProductoId =
        setCategory.selectedCategory.catalogoOrganizacionId;
      custCat.nombre = cat;
      custCat.activo = true;
      itemsArr.push(custCat);
    });

    payload.catalogoProductoDTOList = itemsArr;

    //Insert
    console.log(payload);

    showModal();

    //Hide form
    setDisplayForm(false);
  };

  const handleClick = (e) => {
    e.item = setCategory.selectedCategory;
  };

  return (
    <div className="add-subcategory" onClick={handleClick}>
      {Object.keys(setCategory.selectedCategory).length !== 0 && (
        <div>
          <Row>
            <Col span={4} flex="25%" />
            <Col span={8} flex="auto">
              <Title level={2} className="title">
                Categorias de {setCategory.selectedCategory.nombre}
              </Title>
            </Col>
            <Col span={8} flex="auto">
              <Button
                type="primary"
                className="button"
                onClick={createNewCategory}
              >
                Nueva Categoría
              </Button>
            </Col>
            <Col span={4} flex="25%" />
          </Row>
          <Row>
            <Col span={4} flex="20%" />
            <Col span={16} flex="auto">
              <Form
                name="dynamic_form_item"
                {...formItemLayoutWithOutLabel}
                className={
                  displayForm ? "subcategory-form" : "subcategory-form-hide"
                }
                initialValues={initialValues}
                onFinish={onFinish}
              >
                <div className="container">
                  <div className="column">
                    <Form.List name="names">
                      {(fields, { add, remove }, { errors }) => (
                        <>
                          {fields.map((field, index) => (
                            <Form.Item
                              {...(index === 0
                                ? formItemLayout
                                : formItemLayoutWithOutLabel)}
                              label={index === 0 ? "Categorías" : ""}
                              required={false}
                              key={field.key}
                            >
                              <Form.Item
                                {...field}
                                validateTrigger={["onChange", "onBlur"]}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message:
                                      "Por favor escribe un nombre para la categoría.",
                                  },
                                ]}
                                noStyle
                              >
                                <Input
                                  className="dynamic-input"
                                  placeholder="Nombre de Categoría"
                                  style={{ width: "85%" }}
                                />
                              </Form.Item>
                              {fields.length > 0 ? (
                                <EditOutlined
                                  className="dynamic-edit-button"
                                  onClick={() => console.log("handle edit")}
                                />
                              ) : null}
                              {fields.length > 0 ? (
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  onClick={() => remove(field.name)}
                                />
                              ) : null}
                            </Form.Item>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              style={{ width: "60%" }}
                              icon={<PlusOutlined />}
                            >
                              Agregar campo
                            </Button>
                            <Form.ErrorList errors={errors} />
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </div>
                  <div className="column">
                    <Form.List name="names2">
                      {(fields, { add, remove }, { errors }) => (
                        <>
                          {fields.map((field, index) => (
                            <Form.Item
                              {...(index === 0
                                ? formItemLayout
                                : formItemLayoutWithOutLabel)}
                              label={index === 0 ? "Categorías" : ""}
                              required={false}
                              key={field.key}
                            >
                              <Form.Item
                                {...field}
                                validateTrigger={["onChange", "onBlur"]}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message:
                                      "Por favor escribe un nombre para la categoría.",
                                  },
                                ]}
                                noStyle
                              >
                                <Input
                                  className="dynamic-input"
                                  placeholder="Nombre de Categoría"
                                  style={{ width: "85%" }}
                                />
                              </Form.Item>
                              {fields.length > 0 ? (
                                <EditOutlined
                                  className="dynamic-edit-button"
                                  onClick={() => console.log("handle edit")}
                                />
                              ) : null}
                              {fields.length > 0 ? (
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  onClick={() => {
                                    remove(field.name);
                                    console.log(field);
                                  }}
                                />
                              ) : null}
                            </Form.Item>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => {
                                add();
                              }}
                              style={{ width: "60%" }}
                              icon={<PlusOutlined />}
                            >
                              Agregar campo
                            </Button>
                            <Form.ErrorList errors={errors} />
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </div>
                </div>
                <Form.Item className="bottom-section">
                  <Button type="primary" className="button" htmlType="submit">
                    Guardar
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col span={4} flex="20%" />
          </Row>

          <Modal
            title=""
            width={"50%"}
            height={"50%"}
            className="custom-modal"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            closable={true}
            bodyStyle={{ padding: "10px 24px 10px 24px", overflowY: "auto" }}
            footer={null}
          >
            <div className="description-container">
              <div className="photo">
                <img src={cert_img} alt="sub assistant" />
              </div>
              <div className="general">
                <p>Tu información se ha actualizado con Éxito!</p>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default AddSubCategory;
