import React, { useEffect, useState, useRef } from "react";
import { Typography, Row, Col, Form, Input, Button, Modal } from "antd";
import axios from "axios";
import {
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined
} from "@ant-design/icons";
import "./addSubCategory.css";

import { API_ADMIN } from "../../context/constants";
import cert_img from "../../images/Certification.gif";

const { Title } = Typography;
const urlGET = API_ADMIN + "catalogo-producto/catalogo-organizacion/";
const urlPOST = API_ADMIN + "catalogo-producto";

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
/* var payload = {
  catalogoProductoDTOList: [],
}; */

var payload = [];

const catalogProduct = {
  catalogoProductoId: "",
  nombre: "",
  activo: true,
};

var initForm = {
  names: [],
  names2: [],
};

const AddSubCategory = (category) => {
  const [setCategory, setSelectedCategory] = useState(category);
  const [subCategory, setSubCategory] = useState("");
  const [initialValues, setInitialValues] = useState("");
  const [displayForm, setDisplayForm] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const formRef = useRef(null);

  useEffect(() => {
    if (category !== setCategory && Object.keys(category.selectedCategory).length !== 0) {
      const idCatalog = category.selectedCategory.catalogoOrganizacionId;
      setSelectedCategory(category);
      setDisplayForm(false);

      // Get SubCategory by Category Id
      axios
        .get(urlGET + idCatalog)
        .then((res) => {
          setSubCategory(res.data.catalogoProductoDTOList);
          const light = res.data.catalogoProductoDTOList;

          if (Object.keys(light).length !== 0) {
            const valuesForm = Object.create(initForm);
            let itemsArr1 = [];
            let itemsArr2 = [];

            let flag = false;
            light.forEach((prod) => {
              //TODO: Validate organization catalog Id
              if (flag) {
                itemsArr2.push(prod.catalogoProductoNombre);
                flag = false;
              } else {
                itemsArr1.push(prod.catalogoProductoNombre);
                flag = true;
              }
            });

            valuesForm.names = itemsArr1;
            valuesForm.names2 = itemsArr2;

            setInitialValues(valuesForm);
            formRef.current.setFieldsValue(valuesForm);
          }
        })
        .catch(function (error) {
          setInitialValues(initForm);
          formRef.current.setFieldsValue(initForm);
          console.log(error);
        });
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

    let newPayload = Object.create(payload);

    let itemsArr = [];
    values.names.forEach((cat) => {
      const result = subCategory.find(e => e.catalogoProductoNombre === cat);
      if (typeof result === "undefined"){
        //console.log("no existe");
        const custCat = Object.create(catalogProduct);
        custCat.catalogoOganizacionId = setCategory.selectedCategory.catalogoOrganizacionId;
        custCat.catalogoProductoNombre = cat;
        custCat.activo = true;
        itemsArr.push(custCat);
      }
    });

    values.names2.forEach((cat) => {
      const result = subCategory.find(e => e.catalogoProductoNombre === cat);
      if (typeof result === "undefined"){
        //console.log("no existe");
        const custCat = Object.create(catalogProduct);
        custCat.catalogoOganizacionId = setCategory.selectedCategory.catalogoOrganizacionId;
        custCat.catalogoProductoNombre = cat;
        custCat.activo = true;
        itemsArr.push(custCat);
      }
    });

    newPayload = itemsArr;

    //Insert
    console.log(newPayload);

    axios
      .post(urlPOST, newPayload)
      .then((response) => {
        if (response.status === 201) {
          //limpiar carrito
          showModal();
          //Hide form
          setDisplayForm(false);

          // Get SubCategory by Category Id
          const idCatalog = setCategory.selectedCategoy.catalogoOrganizacionId;
          axios
          .get(urlGET + idCatalog)
          .then((res) => {
            setSubCategory(res.data.catalogoProductoDTOList);
          })
          .catch(function (error) {
            console.log(error);
          });
        }
        else {
          console.log("error");
        }
      })
      .catch(function (error) {
        console.log(error);
      });

     
  };

  const handleClick = (e) => {
    e.item = setCategory.selectedCategory;
  };

  const deleteReflect = (remove, index, arr, len) => {
    let { getFieldValue } = formRef.current;

    let itemByIndex = getFieldValue(arr)[index];
    console.log("Item para borrar: " + itemByIndex);

    /* Elaborate this to update InitialValues prop*/
    const actualValues = initialValues;
    if (arr === "names") {
      actualValues.names = initialValues.names.filter(item => item !== itemByIndex);
    }
    else {
      actualValues.names2 = initialValues.names2.filter(item => item !== itemByIndex);
    }

    //Verificar en las props actuales
    const result = subCategory.find(e => e.catalogoProductoNombre === itemByIndex);

    //Existe en lo consultado de la BD
    if (result) {
      //Enviar a la BD
      console.log("Enviar registro a la BD para eliminación:");
      console.log(result);

      //Setear nuevamente subCategories
      setSubCategory(subCategory.filter(item => item.catalogoProductoId !== result.catalogoProductoId));
      setInitialValues(actualValues);
      remove(index);
    }
    else {
      remove(index);
      setInitialValues(actualValues);
    }
  }

  return (
    <div className="add-subcategory" onClick={handleClick}>
      {Object.keys(setCategory.selectedCategory).length !== 0 && (
        <div>
          <Row>
            <Col span={4} flex="25%" />
            <Col span={8} flex="auto">
              <Title level={2} className="title">
                Catálogos de {setCategory.selectedCategory.catalogoOrganizacionNombre}
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
                ref={formRef}
                name="dynamic_form_item"
                {...formItemLayoutWithOutLabel}
                // className={"subcategory-form"}
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
{/*                               {fields.length > 0 ? (
                                <SaveOutlined
                                  className="dynamic-save-button"
                                  onClick={() => console.log("handle save")}
                                />
                              ) : null} */}
                              {fields.length > 0 ? (
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  onClick={() => deleteReflect(remove, field.name, "names", fields.length)}
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
{/*                               {fields.length > 0 ? (
                                <SaveOutlined
                                  className="dynamic-save-button"
                                  onClick={() => console.log("handle save")}
                                />
                              ) : null} */}
                              {fields.length > 0 ? (
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  onClick={() => deleteReflect(remove, field.name, "names2", fields.length)}
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
