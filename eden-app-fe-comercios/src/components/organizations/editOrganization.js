import React from "react";
import { Row, Col, Form, Input, Button } from "antd";

import "./editOrganization.css";
import { Redirect } from "react-router";

const EditOrganization = (props) => {
  const [form] = Form.useForm();

  let item = props.location.state;
  if (typeof item !== "undefined") {
    item = item.props.organization;
  }
  else{
    item = "";
  }
  console.log(item);

  const onFinish = (values) => {};

  /*   const onReset = () => {
    form.resetFields();
  }; */

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="add-organization">
      {item !== "" ? (
        <div>
          <Row wrap={false}>
            <Col>
              <div className="logo-container">
                <img className="logo" src="" alt="" />
              </div>
            </Col>
            <Col className="upper-right">
              <div className="banner-container">
                <img className="banner" src="" alt="" />
              </div>
            </Col>
          </Row>
          <Row wrap={false}>
            <Col flex="auto" className="lower-form">
              <Form
                name="basic"
                form={form}
                className="form"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Row>
                  <Col>
                    <Form.Item
                      label="Nombre Organización"
                      name="organizacion"
                      className="label"
                      initialValue={item.nombre}
                      rules={[
                        {
                          required: true,
                          message: "Escribe el nombre de la Organización",
                        },
                      ]}
                    >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item
                      label="Categoría"
                      name="category"
                      className="label"
                      initialValue={item.catalogoOrganizacionId}
                      rules={[
                        {
                          required: true,
                          message: "Escribe el nombre de la categoría",
                        },
                      ]}
                    >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item
                      label="Descripcion"
                      name="description"
                      className="label"
                      initialValue={item.descripcion}
                    >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item label="Teléfono" name="phone" className="label" initialValue={item.telefono}>
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item
                      label="Registro Mercantil"
                      name="registry"
                      className="label"
                      //initialValue={item.telefono}
                      rules={[
                        {
                          required: true,
                          message:
                            "Escriba el registro mercantil de la organización",
                        },
                      ]}
                    >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item
                      label="Registro Nacional de Turismo"
                      name="registry-tourism"
                      className="label"
                      //initialValue={item.telefono}
                    >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item
                      label="Registro Único Tributario"
                      name="registry-rut"
                      className="label"
                      //initialValue={item.telefono}
                      rules={[
                        {
                          required: true,
                          message:
                            "Digita el registro mercantil de la organización",
                        },
                      ]}
                    >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item label="Estado" name="status" className="label" initialValue={item.activo}>
                      <Input className="input" />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      label="Facebook"
                      name="url-facebook"
                      className="label"
                      //initialValue={item.telefono}
                    >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item
                      label="Twitter"
                      name="url-twitter"
                      className="label"
                      //initialValue={item.telefono}
                    >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item
                      label="Whatsapp"
                      name="url-whatsapp"
                      className="label"
                      //initialValue={item.telefono}
                    >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item
                      label="Instagram"
                      name="url-instagram"
                      className="label"
                      //initialValue={item.telefono}
                    >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item
                      label="TikTok"
                      name="url-tiktok"
                      className="label"
                      //initialValue={item.telefono}
                    >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item 
                      label="Web" 
                      name="url-web" 
                      className="label" 
                      // initialValue={item.telefono}
                      >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item
                      label="Bio"
                      name="bio"
                      className="label"
                      rules={[
                        {
                          required: true,
                          message:
                            "Escriba una breve biografía de la organización",
                        },
                      ]}
                    >
                      <Input.TextArea className="input" />
                    </Form.Item>
                    <div className="required-form">
                      Los campos marcados con{" "}
                      <span className="required">*</span> deben ser
                      diligenciados para realizar el registro.
                    </div>
                  </Col>
                </Row>
                <Row className="button-section">
                  <Col className="left-button">
                    <Button className="cancel-button" htmlType="button">
                      <span className="button-text">Cancelar</span>
                    </Button>
                  </Col>
                  <Col className="right-button">
                    <Button className="cancel-button" htmlType="submit">
                      <span className="button-text">Guardar</span>
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </div>
      ) : <Redirect to="/" /> } 
    </div>
  );
};

export default EditOrganization;
