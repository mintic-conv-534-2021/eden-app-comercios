import React, { useEffect, useState } from "react";
import { Row, Col, Form, Input, Button, message, Select, Checkbox, Modal, Upload, notification } from "antd";
import axios from "axios";
import "./addOrganization.css";

import { API_ADMIN } from "../../context/constants";
import cert_img from "../../images/Certification.gif";

import { useHistory } from "react-router-dom";
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

const urlCategories = API_ADMIN + "catalogo-organizacion?filtrar-activos=true";
const urlOrganizationPOST = API_ADMIN + "organizacion";

const { Option } = Select;

const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
        onSuccess("ok");
    }, 0);
};

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
    redSocial: {
        urlFacebook: "",
        urlTwitter: "",
        whatsapp: "",
        urlInstagram: "",
        urlTiktok: "",
        webPage: "",
    },
    catalogoOrganizacionId: 0,
};

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

const openNotificationWithIcon = (type, title, message) => {
    notification[type]({
        message: title,
        description: message,
    });
};

const AddOrganization = (props) => {
    const [loadingLogo, setLoadingLogo] = useState("");
    const [shouldProcessLogo, setShouldProcessLogo] = useState(false);
    const [imageLogoUrl, setImageLogoUrl] = useState("");
    const [loadingBanner, setLoadingBanner] = useState("");
    const [shouldProcessBanner, setShouldProcessBanner] = useState(false);
    const [imageBannerUrl, setImageBannerUrl] = useState("");

    const [categories, setCategories] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [estaActiva, setEstaActiva] = useState(true);

    const [form] = Form.useForm();
    let history = useHistory();

    const onReset = () => {
        form.resetFields();
        setImageBannerUrl("");
        setImageLogoUrl("");
        setShouldProcessLogo(false);
        setShouldProcessBanner(false);
    };

    useEffect(() => {
        axios
            .get(urlCategories)
            .then((res) => {
                setCategories(res.data.catalogoOrganizacionDTOList);
            })
            .catch(function (error) {
                setCategories({});
                console.log(error);
            });
    }, []);

    function beforeUploadLogo(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('El archivo debe ser de tipo JPG/PNG!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('La imagen debe tener un máximo de 2MB!');
        }
        setShouldProcessLogo(isJpgOrPng);
    }

    function beforeUploadBanner(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('El archivo debe ser de tipo JPG/PNG!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('La imagen debe tener un máximo de 2MB!');
        }
        setShouldProcessBanner(isJpgOrPng);
    }

    const handleChangeLogo = (info) => {
        if (!shouldProcessLogo) {
            return;
        }

        if (info.file.status === 'uploading') {
            setLoadingLogo(true)
            return;
        }

        getBase64(info.file.originFileObj, imageUrl =>
            setImageLogoUrl(imageUrl),
            setLoadingLogo(false)
        );
    };

    const handleChangeBanner = (info) => {
        if (!shouldProcessBanner) {
            return;
        }

        if (info.file.status === 'uploading') {
            setLoadingBanner(true)
            return;
        }

        getBase64(info.file.originFileObj, imageUrl =>
            setImageBannerUrl(imageUrl),
            setLoadingBanner(false)
        );
    };

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
        if (values.upload_logo == null) {
            openNotificationWithIcon('warning', 'Advertencia', 'Debes cargar un logo para la organización');
            return;
        }

        if (values.upload_banner == null) {
            openNotificationWithIcon('warning', 'Advertencia', 'Debes cargar un banner para la organización');
            return;
        }

        console.log("Success:", values);

        //Create object
        const organizationToAdd = Object.create(updateOrganization);
        organizationToAdd.nombre = values.organizacion;
        organizationToAdd.descripcion = values.bio;
        organizationToAdd.telefono = (typeof values.phone !== "undefined") ? values.phone : "";
        organizationToAdd.direccion = (typeof values.address !== "undefined") ? values.address : "";
        organizationToAdd.email = "";
        organizationToAdd.rm = values.registry;
        organizationToAdd.rut = values.registry_rut;
        organizationToAdd.rnt = (typeof values.registry_tourism !== "undefined") ? values.registry_tourism : "";
        organizationToAdd.activo = estaActiva;
        organizationToAdd.catalogoOrganizacionId = values.category;
        organizationToAdd.redSocial = {
            urlFacebook: (typeof values.url_facebook !== "undefined") ? values.url_facebook : "",
            urlTwitter: (typeof values.url_twitter !== "undefined") ? values.url_twitter : "",
            whatsapp: (typeof values.url_whatsapp !== "undefined") ? values.url_whatsapp : "",
            urlInstagram: (typeof values.url_instagram !== "undefined") ? values.url_instagram : "",
            urlTiktok: (typeof values.url_tiktok !== "undefined") ? values.url_tiktok : "",
            webPage: (typeof values.url_webpage !== "undefined") ? values.url_webpage : ""
        };

        var bodyFormData = new FormData();
        console.log(organizationToAdd);

        //Process Update
        // Appending info to body form data
        const json = JSON.stringify(organizationToAdd);
        const blob = new Blob([json], {
            type: 'application/json'
        });

        bodyFormData.append('request', blob);
        if (typeof values.upload_logo.file !== "undefined") {
            bodyFormData.append('logo', values.upload_logo.file.originFileObj, values.upload_logo.file.name);
        }
        if (typeof values.upload_banner.file !== "undefined") {
            bodyFormData.append('banner', values.upload_banner.file.originFileObj, values.upload_banner.file.name);
        }
        if (typeof values.upload_rut.file !== "undefined") {
            bodyFormData.append('rut', values.upload_rut.file.originFileObj, values.upload_rut.file.name);
        }
        if (typeof values.upload_rm.file !== "undefined") {
            bodyFormData.append('rm', values.upload_rm.file.originFileObj, values.upload_rm.file.name);
        }
        if (typeof values.upload_rt.file !== "undefined") {
            bodyFormData.append('rnt', values.upload_rt.file.originFileObj, values.upload_rt.file.name);
        }

        axios({
            method: 'post',
            url: urlOrganizationPOST,
            data: bodyFormData,
            headers: {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        })
            .then((response) => {
                if (response.status === 201) {
                    showModal();
                    onReset();
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

    const uploadButtonLogo = (
        <div>
            <div style={{ marginTop: 8 }}>
                {"Agregar Logo de Organización"}
            </div>
            {loadingLogo ? <LoadingOutlined /> : <PlusOutlined />}
        </div>
    );

    const uploadButtonBanner = (
        <div>
            <div style={{ marginTop: 8 }}>
                {"Agregar Banner de Organización"}
            </div>
            {loadingBanner ? <LoadingOutlined /> : <PlusOutlined />}
        </div>
    );

    return (
        <div className="add-organization">
            <div>
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
                    <Row wrap={false}>
                        <Col>
                            <div className="logo-container">
                                <Form.Item
                                    name="upload_logo"
                                    label=""
                                    valuePropName="image"
                                    extra=""
                                >
                                    <Upload
                                        name="logo"
                                        showUploadList={false}
                                        accept="image/jpeg,image/png"
                                        customRequest={dummyRequest}
                                        beforeUpload={beforeUploadLogo}
                                        onChange={handleChangeLogo}
                                        className="upload-logo"
                                        listType="picture-card">
                                        {imageLogoUrl ?
                                            <img className="logo" src={imageLogoUrl} alt="logo" /> : uploadButtonLogo}
                                    </Upload>
                                </Form.Item>
                            </div>
                        </Col>
                        <Col className="upper-right">
                            <div className="banner-container">
                                <Form.Item
                                    name="upload_banner"
                                    label=""
                                    valuePropName="image"
                                    extra=""
                                >
                                    <Upload
                                        name="banner"
                                        accept="image/jpeg,image/png"
                                        showUploadList={false}
                                        customRequest={dummyRequest}
                                        beforeUpload={beforeUploadBanner}
                                        onChange={handleChangeBanner}
                                        className="upload-banner"
                                        listType="picture-card">
                                        {imageBannerUrl ?
                                            <img className="banner" src={imageBannerUrl} alt="banner" /> : uploadButtonBanner}
                                    </Upload>
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>
                    <Row wrap={false}>
                        <Col flex="auto" className="lower-form">
                            <Row>
                                <Col>
                                    <Form.Item
                                        label="Nombre Organización"
                                        name="organizacion"
                                        className="label"
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
                                                    <Option
                                                        key={i.catalogoOrganizacionId}
                                                        value={i.catalogoOrganizacionId}
                                                    >
                                                        {i.catalogoOrganizacionNombre}
                                                    </Option>
                                                )
                                            }
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="Dirección"
                                        name="address"
                                        className="label"
                                    >
                                        <Input className="input" />
                                    </Form.Item>

                                    <Form.Item label="Teléfono" name="phone" className="label">
                                        <Input className="input" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Registro Mercantil"
                                        name="registry"
                                        className="label"
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
                                    >
                                        <Input className="input" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Registro Único Tributario"
                                        name="registry_rut"
                                        className="label"
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

                                    <Form.Item
                                        name="upload_rut"
                                        label="Documento RUT"
                                        extra=""
                                        valuePropName="document"
                                    >
                                        <Upload
                                            name="rm"
                                            accept="application/pdf"
                                            customRequest={dummyRequest}
                                            maxCount={1}
                                            className="upload-rut"
                                            listType="text">
                                            <Button icon={<UploadOutlined />}>Cargar RUT</Button>
                                        </Upload>
                                    </Form.Item>

                                    <Form.Item
                                        name="upload_rm"
                                        label="Documento Registro Mercantil"
                                        extra=""
                                        valuePropName="document"
                                    >
                                        <Upload
                                            name="rm"
                                            accept="application/pdf"
                                            customRequest={dummyRequest}
                                            maxCount={1}
                                            className="upload-rm"
                                            listType="text">
                                            <Button icon={<UploadOutlined />}>Cargar Registro Mercantil</Button>
                                        </Upload>
                                    </Form.Item>

                                    <Form.Item
                                        name="upload_rt"
                                        label="Documento Registro Turismo"
                                        extra=""
                                        valuePropName="document"
                                    >
                                        <Upload
                                            name="rm"
                                            accept="application/pdf"
                                            customRequest={dummyRequest}
                                            maxCount={1}
                                            className="upload-rt"
                                            listType="text">
                                            <Button icon={<UploadOutlined />}>Cargar Registro Turismo</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item
                                        label="Estado"
                                        name="status"
                                        className="label"
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
                                    >
                                        <Input className="input" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Twitter"
                                        name="url_twitter"
                                        className="label"
                                    >
                                        <Input className="input" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Whatsapp"
                                        name="url_whatsapp"
                                        className="label"
                                    >
                                        <Input className="input" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Instagram"
                                        name="url_instagram"
                                        className="label"
                                    >
                                        <Input className="input" />
                                    </Form.Item>

                                    <Form.Item
                                        label="TikTok"
                                        name="url_tiktok"
                                        className="label"
                                    >
                                        <Input className="input" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Web"
                                        name="url_web"
                                        className="label"
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
                                    <Button className="action-button" htmlType="button" onClick={Cancel}>
                                        <span className="button-text">Cancelar</span>
                                    </Button>
                                </Col>
                                <Col className="right-button">
                                    <Button className="action-button" htmlType="submit">
                                        <span className="button-text">Guardar</span>
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>

            </div>

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
                        <p>Tu información se ha almacenado con Éxito!</p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AddOrganization;
