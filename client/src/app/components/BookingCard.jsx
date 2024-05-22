import React, { useState } from 'react'
import { Form, Input, DatePicker, TimePicker, Button, Space } from 'antd'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const BookingCard = ({ sendDataToParent }) => {
  const [error, setError] = useState(null)
  const [form] = Form.useForm()

  const onFinish = (values) => {
    values = {
      ...values,
      formattedDate: values.date.format('MMMM D, YYYY'),
      formattedTime: values.time.format('HH:mm a'),
    }
    sendDataToParent(values)
    // reset all fields.
    form.resetFields()
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
    setError(error)
  }

  if (error) {
    return <p>Error, please try again...</p>
  }
  return (
    <Form
      form={form}
      initialValues={{ time: dayjs().startOf('day').add(10, 'hour') }}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onSubmit={(e) => e.preventDefault()}
      size="large"
    >
      <Form.Item label="Name" name="name" required>
        <Input placeholder="Enter your name" required />
      </Form.Item>

      <Form.Item
        label="Mobile"
        name="mobile"
        required
        rules={[
          {
            pattern: /^(?:\+?91\s?)?0?[0-9]{10}$/,
            message: 'Please enter a valid 10-digit mobile number',
          },
        ]}
      >
        <Input placeholder="Enter your mobile number" required />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { type: 'email', message: 'Please enter a valid email address' },
        ]}
      >
        <Input placeholder="Enter your email" />
      </Form.Item>

      <Form.Item
        label="Date"
        name="date"
        required
        rules={[{ required: true, message: 'Please enter a date' }]}
      >
        {/* mindate should be today's date */}
        <DatePicker
          disabledDate={(current) =>
            current && current < dayjs().startOf('day')
          }
          onCalendarChange={(value) => {
            const dateString = value.format('MMMM D, YYYY')
          }}
        />
      </Form.Item>

      <Form.Item
        label="Time"
        name="time"
        required
        rules={[{ required: true, message: 'Please enter a time' }]}
      >
        <TimePicker
          format="h:mm a"
          disabledTime={(current) => {
            return {
              disabledHours: () => [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 20, 21, 22, 23,
              ],
            }
          }}
          hideDisabledOptions={true}
          showNow={false}
          defaultValue={dayjs().startOf('day').add(10, 'hour')}
          minuteStep={30}
          onCalendarChange={(value) => {
            const timeString = value ? value.format('HH:mm a') : ''
          }}
        />
      </Form.Item>
      {/* <Form.Item> */}
      <Button
        type=""
        className="mt-10 flex w-full items-center !hover:text-custom-black justify-center md:rounded-md border !border-custom-yellow !text-custom-jet !bg-custom-yellow px-8 py-3 text-base font-medium  !hover:bg-yellow-600  !hover:border-transparent !focus:outline-none !focus:ring-2 !focus:ring-yellow-500 focus:ring-transparent fixed bottom-0 left-0 right-0 z-50 md:static rounded-none"
        htmlType="submit"
      >
        Book Now
      </Button>
      {/* </Form.Item> */}
    </Form>
  )
}

export default BookingCard
