import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message, Row, Col, notification } from 'antd';
import axios from 'axios'
import { API_ADMIN } from "../../context/constants"

import './addCategory.css';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const urlPOST = API_ADMIN + 'catalogo-organizacion'
const FormData = require('form-data');

const openNotificationWithIcon = (type, title, message) => {
    notification[type]({
        message: title,
        description: message,
    });
};

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

const AddCategory = (props) => {
    //Variables
    const [loading, setLoading] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [shouldProcessImage, setShouldProcessImage] = useState(false);
    const [shouldEdit, setShouldEdit] = useState(false);
    const [itemEdit, setItemEdit] = useState({});

    const [form] = Form.useForm();

    //Update everytime props changes
    useEffect(() => {
        if (Object.keys(props.categoryToEdit).length > 0) {
            let categoryToEdit = props.categoryToEdit.category;

            let file =
            {
                uid: '1',
                name: 'image.png',
                status: 'done',
                url: categoryToEdit.urlImagen,
            };

            let editValues = {
                category: categoryToEdit.catalogoOrganizacionNombre,
                description: categoryToEdit.descripcion,
                upload: file
            }

            setShouldEdit(true);
            setItemEdit(categoryToEdit);
            form.setFieldsValue(editValues);
            setImageUrl(categoryToEdit.urlImagen);
        }
    }, [props, form]);

    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('El archivo debe ser de tipo JPG/PNG!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('La imagen debe tener un máximo de 2MB!');
        }
        setShouldProcessImage(isJpgOrPng);
    }

    const onFinish = (values) => {
        //console.log(values);
        if (values.upload == null) {
            openNotificationWithIcon('warning', 'Advertencia', 'Debes asociar una imagen antes de guardar');
            return;
        }

        var bodyFormData = new FormData();
        var requestParams = {};

        if (shouldEdit) {
            requestParams = {
                catalogoOrganizacionId: itemEdit.catalogoOrganizacionId,
                catalogoOrganizacionNombre: values.category,
                descripcion: values.description,
                urlImagen: itemEdit.urlImagen
            }
        }
        else {
            requestParams = {
                catalogoOrganizacionNombre: values.category,
                descripcion: values.description,
                urlImagen: "",
                activo: true
            }
        }

        // Appending info to body form data
        const json = JSON.stringify(requestParams);
        const blob = new Blob([json], {
            type: 'application/json'
        });

        bodyFormData.append('request', blob);
        if (typeof values.upload.file !== "undefined") {
            bodyFormData.append('imagen', values.upload.file.originFileObj, values.upload.file.name);
        }

        axios({
            method: shouldEdit ? 'put' : 'post',
            url: urlPOST,
            data: bodyFormData,
            headers : {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
          })
            .then((response) => {
                if (response.status === 201) {
                    //Do something
                    onReset();
                    openNotificationWithIcon('success', 'Éxito', 'Se creó la categoría correctamente');
                }
                else if (response.status === 202) {
                    //Do something
                    onReset();
                    openNotificationWithIcon('success', 'Éxito', 'Se editó la categoría correctamente');
                }
                else {
                    console.log("error");
                    openNotificationWithIcon('error', 'Error al insertar en la BD', 'No pudieron guardarse los datos');
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    };

    const onReset = () => {
        form.resetFields();
        setImageUrl("");
        setShouldEdit(false);
        setItemEdit({});
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleChange = (info) => {
        if (!shouldProcessImage) {
            return;
        }

        if (info.file.status === 'uploading') {
            setLoading(true)
            return;
        }

        getBase64(info.file.originFileObj, imageUrl =>
            setImageUrl(imageUrl),
            setLoading(false)
        );
    };

    const CancelEdit = () => {
        onReset();
    }

    const uploadButton = (
        <div>
            <div style={{ marginTop: 8 }}>
                {shouldEdit ? "Editar Categoría de Organización" : "Agregar Categoría de Organización"}
            </div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
        </div>
    );

    return (
        <div className="add-category">
            <Form
                name="basic"
                form={form}
                className="form"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    name="upload"
                    label=""
                    valuePropName="image"
                    //getValueFromEvent={normFile}
                    extra=""
                >
                    <Upload
                        name="avatar"
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        className="upload-box"
                        listType="picture-card">
                        {imageUrl ?
                            <img className="added-image" src={imageUrl} alt="avatar" /> : uploadButton}
                    </Upload>
                </Form.Item>

                <Form.Item
                    label="Categoría"
                    name="category"
                    className="label"
                    rules={[
                        {
                            required: true,
                            message: 'Escribe el nombre de la categoría',
                        },
                    ]}
                >
                    <Input className="input" />
                </Form.Item>

                <Form.Item
                    label="Descripción"
                    name="description"
                    className="label"
                    rules={[
                        {
                            required: true,
                            message: 'Escribe la descripción de la categoría',
                        },
                    ]}
                >
                    <Input className="input" />
                </Form.Item>

                {!shouldEdit &&
                    <Form.Item>
                        <Button type="primary" className="button button-create" htmlType="submit">
                            Crear Categoría
                        </Button>
                    </Form.Item>
                }

                {shouldEdit &&
                    <Row>
                        <Col>
                            <Form.Item>
                                <Button type="primary" className="button" htmlType="submit">
                                    Actualizar
                                </Button>
                            </Form.Item>
                        </Col>
                        <Col className="cancel-col">
                            <Form.Item>
                                <Button type="primary" onClick={CancelEdit} className="button" htmlType="button">
                                    Cancelar
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                }
            </Form>
        </div>
    )
}

export default AddCategory;