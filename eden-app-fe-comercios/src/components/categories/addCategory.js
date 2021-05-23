import React, { useState } from "react";
import { Form, Input, Button, Upload, message } from 'antd';
import { notification } from 'antd';
import axios from 'axios'
import { API_ADMIN } from "../../context/constants"

import './addCategory.css';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const urlPOST = API_ADMIN + 'catalogo-organizacion'
const urlImage = 'http://www.teste.com.co/';

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

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error('Image must smaller than 2MB!');
    // }
    return isJpgOrPng;
}


const AddCategory = () => {
    //Variables
    const [loading, setLoading] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [image, setImage] = useState("");
    const [form] = Form.useForm();

    const normFile = (e) => {
        console.log('Upload event:', e);

        if (e == null){
            console.log(image);
            setImage("");
            setImageUrl("");
            return null;
        }

        if (Array.isArray(e)) {
            return e;
        }

        e.fileList = e.fileList.slice(-1);
        setImage(e.fileList);
        return image;
    };

    const onFinish = (values) => {
        if (values.upload == null){
            openNotificationWithIcon('warning', 'Advertencia', 'Debes asociar una imagen antes de guardar');
            return;
        }

        const imageBuild = urlImage + values.upload[0].name;
        console.log('Success:', values);
        console.log(values.category);
        console.log(values.description);
        console.log(imageBuild);

        axios.post(urlPOST, {
            nombre: values.category,
            descripcion: values.description,
            urlImagen: image
        })
            .then((response) => {
                if (response.status === 201) {
                    //Do something
                    form.resetFields();
                    openNotificationWithIcon('success', 'Éxito', 'Se creó la categoría correctamente');
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
        normFile(null);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleChange = (info) => {
        /*         if (info.file.status === 'uploading') {
                    setLoading(true)
                    return;
                }
                
                if (info.file.status === 'done') {
                    // Get this url from response in real world.
                    getBase64(info.file.originFileObj, imageUrl =>
                        setImageUrl(imageUrl),
                        setLoading(false)
                    );
                } */

        getBase64(info.file.originFileObj, imageUrl =>
            setImageUrl(imageUrl),
            setLoading(false)
        );
    };

    const uploadButton = (
        <div>
            <div style={{ marginTop: 8 }}>
                Agregar Categoría de Organización
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
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    name="upload"
                    label=""
                    valuePropName="image"
                    getValueFromEvent={normFile}
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

                <Form.Item>
                    <Button type="primary" className="button" htmlType="submit">
                        Crear Categoría
                    </Button>
                    <Button htmlType="button" onClick={onReset}>
                        Reset (Delete this soon)
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default AddCategory;