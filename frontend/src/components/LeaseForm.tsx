import { Form, Input, Modal, DatePicker, InputNumber, Select } from 'antd';
import { useEffect, useState } from 'react';
import api from '../services/api';

const LeaseForm = ({ visible, onCancel, onOk, initialValues }) => {
  const [form] = Form.useForm();
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get('/properties/');
        setProperties(response.data);
      } catch (error) {
        console.error('Failed to fetch properties', error);
      }
    };

    const fetchTenants = async () => {
      try {
        const response = await api.get('/tenants/');
        setTenants(response.data);
      } catch (error) {
        console.error('Failed to fetch tenants', error);
      }
    };

    if (visible) {
      fetchProperties();
      fetchTenants();
    }
  }, [visible]);

  return (
    <Modal
      open={visible}
      title={initialValues ? 'Edit Lease' : 'Create Lease'}
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
      <Form form={form} layout="vertical" name="lease_form" initialValues={initialValues}>
        <Form.Item
          name="property_id"
          label="Property"
          rules={[{ required: true, message: 'Please select a property!' }]}
        >
          <Select>
            {properties.map(property => <Select.Option key={property.id} value={property.id}>{property.name}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item
          name="tenant_id"
          label="Tenant"
          rules={[{ required: true, message: 'Please select a tenant!' }]}
        >
          <Select>
            {tenants.map(tenant => <Select.Option key={tenant.id} value={tenant.id}>{tenant.full_name}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item
          name="start_date"
          label="Start Date"
          rules={[{ required: true, message: 'Please select the start date!' }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="end_date"
          label="End Date"
          rules={[{ required: true, message: 'Please select the end date!' }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="rent_amount"
          label="Rent Amount"
          rules={[{ required: true, message: 'Please input the rent amount!' }]}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LeaseForm;
