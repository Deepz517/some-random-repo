import { Form, Input, Modal, DatePicker, InputNumber, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import api from '../services/api';

const UtilityBillForm = ({ visible, onCancel, onOk, initialValues }) => {
  const [form] = Form.useForm();
  const [leases, setLeases] = useState([]);

  useEffect(() => {
    const fetchLeases = async () => {
      try {
        const response = await api.get('/leases/');
        setLeases(response.data);
      } catch (error) {
        console.error('Failed to fetch leases', error);
      }
    };

    if (visible) {
      fetchLeases();
    }
  }, [visible]);

  return (
    <Modal
      open={visible}
      title={initialValues ? 'Edit Utility Bill' : 'Create Utility Bill'}
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
      <Form form={form} layout="vertical" name="utility_bill_form" initialValues={initialValues}>
        <Form.Item
          name="lease_id"
          label="Lease"
          rules={[{ required: true, message: 'Please select a lease!' }]}
        >
          <Select>
            {leases.map(lease => <Select.Option key={lease.id} value={lease.id}>{`Lease for Property ID: ${lease.property_id}`}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item
          name="bill_type"
          label="Bill Type"
          rules={[{ required: true, message: 'Please input the bill type!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: 'Please input the amount!' }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name="due_date"
          label="Due Date"
          rules={[{ required: true, message: 'Please select the due date!' }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="billing_period"
          label="Billing Period"
          rules={[{ required: true, message: 'Please input the billing period!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="image"
          label="Image"
        >
          <Upload>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UtilityBillForm;
