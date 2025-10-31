import { Form, Input, Modal } from 'antd';

const TenantForm = ({ visible, onCancel, onOk, initialValues }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={visible}
      title={initialValues ? 'Edit Tenant' : 'Create Tenant'}
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
      <Form form={form} layout="vertical" name="tenant_form" initialValues={initialValues}>
        <Form.Item
          name="full_name"
          label="Full Name"
          rules={[{ required: true, message: 'Please input the full name of the tenant!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please input the email of the tenant!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please input the username of the tenant!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="hashed_password"
          label="Password"
          rules={[{ required: true, message: 'Please input the password of the tenant!' }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TenantForm;
