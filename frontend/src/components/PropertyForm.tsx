import { Form, Input, Modal } from 'antd';

const PropertyForm = ({ visible, onCancel, onOk, initialValues }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={visible}
      title={initialValues ? 'Edit Property' : 'Create Property'}
      okText={initialValues ? 'Update' : 'Create'}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onOk(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="property_form" initialValues={initialValues}>
        <Form.Item
          name="name"
          label="Property Name"
          rules={[{ required: true, message: 'Please input the name of the property!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Please input the address of the property!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PropertyForm;
