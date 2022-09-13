import "../my-salary-detail/index.scss";
import React, {useState} from "react";
import {ModalCustom} from "@app/components/ModalCustom";
import {Form, Input, InputNumber, notification} from "antd";
import {useMutation} from "react-query";
import ApiSalary from "@app/api/ApiSalary";

interface IModalCreateDeduction {
  isModalVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  userId: number;
  handleRefetch?: () => void;
}

export default function ModalDeductionHourSalary(
  props: IModalCreateDeduction
): JSX.Element {
  const [date, setDate] = useState<string>();
  const [hourLateWork, setHourLateWork] = useState<number>();
  const createDeductionHourSalary = useMutation(
    ApiSalary.createDeductionHourSalary
  );
  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-info">
        <Form labelCol={{span: 5}} wrapperCol={{span: 19}}>
          <Form.Item label="Ngày nghỉ" name="a">
            <Input
              type="date"
              className="w-full"
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="số giờ nghỉ" name="b">
            <InputNumber
              max={31}
              min={0}
              className="w-full"
              onChange={(e) => {
                setHourLateWork(Number(e));
              }}
            />
          </Form.Item>
        </Form>
      </div>
    );
  };

  const handleOkModal = (): void => {
    const data = {
      user: props?.userId || 0,
      date: date || "",
      hourLateWork: hourLateWork || 0,
    };
    createDeductionHourSalary.mutate(data, {
      onSuccess: () => {
        notification.success({message: "create success"});
        if (props?.handleRefetch) {
          props.handleRefetch();
        }
      },
    });
    props.handleOk();
  };

  return (
    <ModalCustom
      destroyOnClose
      isModalVisible={props.isModalVisible}
      handleOk={handleOkModal}
      handleCancel={props.handleCancel}
      title="Thêm lương khấu trừ theo giờ"
      content={renderContent()}
    />
  );
}
