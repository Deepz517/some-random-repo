import { Form, Input, Modal, DatePicker, InputNumber, Select } from 'antd';
import { useEffect, useState } from 'react';
import api from '../services/api';

const PaymentForm = ({ visible, onCancel, onOk, initialValues }) => {
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
      title={initialValues ? 'Edit Payment' : 'Create Payment'}
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
      <Form form={form} layout="vertical" name="payment_form" initialValues={initialValues}>
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
          name="amount"
          label="Amount"
          rules={[{ required: true, message: 'Please input the amount!' }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name="payment_date"
          label="Payment Date"
          rules={[{ required: true, message: 'Please select the payment date!' }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="payment_method"
          label="Payment Method"
          rules={[{ required: true, message: 'Please select a payment method!' }]}
        >
          <Select>
            <Select.Option value="CASH">Cash</Select.Option>
            <Select.Option value="UPI">UPI</Select.Option>
            <Select.Option value="BANK_TRANSFER">Bank Transfer</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="note_receipt_reference"
          label="Note/Receipt Reference"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PaymentForm;
