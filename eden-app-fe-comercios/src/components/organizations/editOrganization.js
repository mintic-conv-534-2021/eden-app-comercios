import React, { useEffect, useState } from "react";
import { Row, Col, Form, Input, Button, Select, Checkbox, Modal } from "antd";
import axios from "axios";
import "./editOrganization.css";

import { API_ADMIN } from "../../context/constants";
import cert_img from "../../images/Certification.gif";

import rut_image from "../../images/Registry1.png";
import rm_image from "../../images/Registry2.png";

import { useHistory } from "react-router-dom";

const urlCategories = API_ADMIN + "catalogo-organizacion?filtrar-activos=true";
const urlOrganizationPUT = API_ADMIN + "organizacion";

const { Option } = Select;

const updateOrganization = {
  organizacionId: 0,
  nombre: "",
  descripcion: "",
  telefono: "",
  direccion: "",
  email: "",
  rm: "",
  rut: "",
  rnt: "",
  activo: false,
  urlLogo: "",
  urlBanner: "",
  urlRM: "",
  urlRNT: "",
  urlRUT: "",
  redSocialDTO: {
    urlFacebook: "",
    urlTwitter: "",
    whatsapp: "",
    urlInstagram: "",
    urlTiktok: "",
    webPage: "",
  },
  catalogoOrganizacionId: 0,
};

const EditOrganization = (props) => {
  const [organization, setOrganization] = useState("");
  const [categories, setCategories] = useState({});
  const [estaActiva, setEstaActiva] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [form] = Form.useForm();
  let history = useHistory();

  let item = props.location.state;
  if (typeof item !== "undefined") {
    item = item.props.organization;
  }
  else {
    item = "";
    history.push("/");
  }

  useEffect(() => {
    if (item !== "") {
      setEstaActiva(item.activo);
      setOrganization(item);

      axios
        .get(urlCategories)
        .then((res) => {
          setCategories(res.data.catalogoOrganizacionDTOList);
        })
        .catch(function (error) {
          setCategories({});
          console.log(error);
        });
    } else {
      history.push("/");
    }

  }, [item, history]);

  const OnCheckedChanged = (e) => {
    //console.log(`checked = ${e.target.checked}`);
  }

  const ToggleChecked = (e) => {
    setEstaActiva(!estaActiva);
  }

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
    console.log("Success:", values);

    //Create object
    const organizationToUpdate = Object.create(updateOrganization);
    organizationToUpdate.nombre = values.organizacion;
    organizationToUpdate.organizacionId = organization.organizacionId;
    organizationToUpdate.descripcion = values.bio;
    organizationToUpdate.telefono = values.phone;
    organizationToUpdate.direccion = values.address;
    organizationToUpdate.email = organization.email;
    organizationToUpdate.rm = values.registry;
    organizationToUpdate.rut = values.registry_rut;
    organizationToUpdate.rnt = values.registry_tourism;
    organizationToUpdate.activo = estaActiva;
    organizationToUpdate.urlLogo = organization.urlLogo;
    organizationToUpdate.urlBanner = organization.urlBanner;
    organizationToUpdate.urlRM = organization.urlRM;
    organizationToUpdate.urlRNT = organization.urlRNT;
    organizationToUpdate.urlRUT = organization.urlRUT;
    organizationToUpdate.catalogoOrganizacionId = values.category;
    organizationToUpdate.redSocialDTO = {
      urlFacebook: values.url_facebook,
      urlTwitter: values.url_twitter,
      whatsapp: values.url_whatsapp,
      urlInstagram: values.url_instagram,
      urlTiktok: values.url_tiktok,
      webPage: values.url_webpage,
    };

    var bodyFormData = new FormData();
    console.log(organizationToUpdate);

    //Process Update
    // Appending info to body form data
    const json = JSON.stringify(organizationToUpdate);
    const blob = new Blob([json], {
      type: 'application/json'
    });

    bodyFormData.append('request', blob);
    // if (typeof values.upload.file !== "undefined") {
    //   bodyFormData.append('imagen', values.upload.file.originFileObj, values.upload.file.name);
    // }

    axios({
      method: 'put',
      url: urlOrganizationPUT,
      data: bodyFormData,
      headers: {
        headers: {
          'Content-Type': 'application/json'
        },
      }
    })
      .then((response) => {
        if (response.status === 202) {
          showModal();
        } else {
          console.log("error, response status: " + response.status);
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const Cancel = () => {
    history.push("/");
  }

  return (
    <div className="add-organization">
      {item !== "" && (
        <div>
          <Row wrap={false}>
            <Col>
              <div className="logo-container">
                <img className="logo" src={item.urlLogo} alt="" />
              </div>
            </Col>
            <Col className="upper-right">
              <div className="banner-container">
                <img className="banner" src={item.urlBanner} alt="" />
              </div>
            </Col>
          </Row>
          <Row wrap={false}>
            <Col flex="auto" className="lower-form">
              <Form
                name="basic"
                form={form}
                className="form-edit"
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
                      <Select name="selectedOption" className="input">
                        {categories.length != null &&
                          categories.map((i) =>
                            i.catalogoOrganizacionId ===
                              item.catalogoOrganizacionId ? (
                              <Option
                                key={i.catalogoOrganizacionId}
                                value={i.catalogoOrganizacionId}
                                selected
                              >
                                {i.catalogoOrganizacionNombre}
                              </Option>
                            ) : (
                              <Option
                                key={i.catalogoOrganizacionId}
                                value={i.catalogoOrganizacionId}
                              >
                                {i.catalogoOrganizacionNombre}
                              </Option>
                            )
                          )}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Dirección"
                      name="address"
                      className="label"
                      initialValue={item.direccion}
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
                      initialValue={item.rm}
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
                      name="registry_tourism"
                      className="label"
                      initialValue={item.rnt}
                    >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item
                      label="Registro Único Tributario"
                      name="registry_rut"
                      className="label"
                      initialValue={item.rut}
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

                    <Row>
                      <Col className="separator" />
                      <Col>
                        {item.urlRUT &&
                          <a href={item.urlRUT} target="blank">
                            <img src={rut_image} alt="" className="left-image" />
                          </a>
                        }
                        {item.urlRM &&
                          <a href={item.urlRM} target="blank">
                            <img src={rm_image} alt="" />
                          </a>
                        }
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <Form.Item
                      label="Estado"
                      name="status"
                      className="label"
                      initialValue={item.activo}
                    >
                      <Checkbox
                        checked={estaActiva}
                        onChange={OnCheckedChanged}
                        onClick={ToggleChecked}>
                        {estaActiva ? "Activo" : "Inactivo"}
                      </Checkbox>
                    </Form.Item>

                    <Form.Item
                      label="Facebook"
                      name="url_facebook"
                      className="label"
                      initialValue={item.redSocial.urlFacebook}
                    >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item
                      label="Twitter"
                      name="url_twitter"
                      className="label"
                      initialValue={item.redSocial.urlTwitter}
                    >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item
                      label="Whatsapp"
                      name="url_whatsapp"
                      className="label"
                      initialValue={item.redSocial.whatsapp}
                    >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item
                      label="Instagram"
                      name="url_instagram"
                      className="label"
                      initialValue={item.redSocial.urlInstagram}
                    >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item
                      label="TikTok"
                      name="url_tiktok"
                      className="label"
                      initialValue={item.redSocial.urlTiktok}
                    >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item
                      label="Web"
                      name="url_web"
                      className="label"
                      initialValue={item.redSocial.webPage}
                    >
                      <Input className="input" />
                    </Form.Item>

                    <Form.Item
                      label="Bio"
                      name="bio"
                      className="label"
                      initialValue={item.descripcion}
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
                    <Button className="cancel-button" htmlType="button" onClick={Cancel}>
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

export default EditOrganization;
