import "./index.scss";
import {Button, Card, Col, Image, Modal, notification, Row, Table} from "antd";
import type {ColumnsType} from "antd/es/table";
import React, {useEffect, useState} from "react";
import ApiUser, {
  IInformationAccountBody,
  IResetPasswordBody,
} from "@app/api/ApiUser";
import {IUserLogin, IWorkType} from "@app/types";
import {useMutation, useQuery} from "react-query";
import Icon from "@app/components/Icon/Icon";
import {ModalInfo} from "@app/module/account-manager/ModalConfirm";
import {renameKeys} from "@app/utils/convert/ConvertHelper";
import {SelectInput2} from "@app/components/Modal/SelectInput2";
import {ModalChangePass} from "@app/module/account-manager/ModalChangePass";

export function AccountManager(): JSX.Element {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalChangePassVisible, setIsModalChangePassVisible] =
    useState(false);
  const [dataDetail, setDataDetail] = useState<IUserLogin>({});

  const handleOk = (data: IUserLogin): void => {
    Modal.confirm({
      title: "Xác nhận sửa thông tin nhân viên?",
      okType: "primary",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: () => {
        handleUpdateInformationAccount(data);
        setIsModalVisible(false);
      },
    });
  };

  const handleCancel = (): void => {
    setIsModalVisible(false);
  };

  const handleConfirmChangePass = (newPassword: string): void => {
    Modal.confirm({
      title: "Xác nhận sửa thông tin nhân viên?",
      okType: "primary",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: () => {
        handleResetPasswordForAccount(newPassword);
        setIsModalChangePassVisible(false);
      },
    });
  };

  const handleCancelChangePass = (): void => {
    setIsModalChangePassVisible(false);
  };

  const getUserAccount = (): Promise<IUserLogin[]> => {
    return ApiUser.getUserAccount({pageSize: 30, pageNumber: 1});
  };

  const dataUserAccount = useQuery("listUserAccount", getUserAccount);

  useEffect(() => {
    dataUserAccount.refetch();
  }, []);

  const getListWorkType = (): Promise<IWorkType[]> => {
    return ApiUser.getListWorkType();
  };

  const getListPosition = (): Promise<IWorkType[]> => {
    return ApiUser.getListPosition();
  };

  const listWorkType = useQuery("getListWorkType", getListWorkType);
  const listPosition = useQuery("getListPosition", getListPosition);

  const newKeys = {id: "value", name: "label"};

  const listPositionConvert: {value: number; label: string}[] = [];
  listPosition?.data?.map((el) => {
    const renamedObj = renameKeys(el || {}, newKeys);
    listPositionConvert.push(renamedObj);
    return listPositionConvert;
  });

  const listWorkTypeConvert: {value: number; label: string}[] = [];
  listWorkType?.data?.map((el) => {
    const renamedObj = renameKeys(el || {}, newKeys);
    listWorkTypeConvert.push(renamedObj);
    return listPositionConvert;
  });

  const handleUserAction = (record: IUserLogin): void => {
    Modal.confirm({
      title: `Bạn có muốn khoá tài khoản ${record.email}?`,
      content: `Tài khoản ${record.email} sẽ bị khoá`,
      okType: "primary",
      cancelText: "Huỷ",
      okText: "Khoá",
      onOk: () => {
        // todo
      },
    });
  };

  const updateProfile = useMutation(ApiUser.updateInformationAccount, {
    onSuccess: (data) => {
      notification.success({
        duration: 1,
        message: `Sửa thành công`,
      });
      dataUserAccount.refetch();
    },
    onError: () => {
      notification.error({
        duration: 1,
        message: `Sửa thất bại`,
      });
    },
  });

  const handleUpdateInformationAccount = (values: IUserLogin): void => {
    const body: IInformationAccountBody = {
      id: Number(dataDetail.id),
      personId: values.personId,
      dateOfBirth: values.dateOfBirth,
      position: values.positionId,
      workType: values.workTypeId,
      address: values.address,
      phoneNumber: values.phoneNumber,
      phoneNumberRelative: values.phoneNumberRelative,
      baseSalary: values.baseSalary,
      email: values.email,
      fullName: values.fullName,
      deductionOwn: values.deductionOwn,
    };
    updateProfile.mutate(body);
  };

  const resetPasswordForAccount = useMutation(ApiUser.resetPasswordForAccount, {
    onSuccess: (data) => {
      notification.success({
        duration: 1,
        message: `Sửa thành công`,
      });
      dataUserAccount.refetch();
    },
    onError: () => {
      notification.error({
        duration: 1,
        message: `Sửa thất bại`,
      });
    },
  });

  const handleResetPasswordForAccount = (newPassword: string): void => {
    const body: IResetPasswordBody = {
      id: Number(dataDetail.id),
      newPassword: newPassword,
    };
    resetPasswordForAccount.mutate(body);
  };

  const columns: ColumnsType<IUserLogin> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: "Ảnh",
      key: "avatar",
      align: "center",
      width: 80,
      render: (_, record) => {
        return (
          <div>
            <Image
              src={record.avatar || "img/avatar/avatar.jpg"}
              fallback="img/avatar/avatar.jpg"
            />
          </div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Họ & Tên",
      dataIndex: "fullName",
      key: "fullName",
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      align: "center",
    },
    {
      title: "Quản lý",
      dataIndex: "manager",
      key: "manager",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            <span>{record?.manager?.fullName}</span>
          </div>
        );
      },
    },
    {
      title: "Vị trí",
      dataIndex: "workType",
      key: "workType",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            <span>{record?.workType?.name}</span>
          </div>
        );
      },
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      key: "position",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            <span>{record?.position?.name}</span>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      align: "center",
      key: "state",
      render: (_, record) => {
        return (
          <div
            className={
              record.state === 1
                ? "light-status-account active"
                : "light-status-account"
            }
          />
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          className="mr-1"
          onClick={(): void => {
            handleUserAction(record);
          }}
          icon={<Icon icon="BlockUser" size={20} />}
        />
      ),
    },
  ];

  return (
    <div className="account-manager-page">
      <Card className="mb-4">
        <div>
          <Row>
            <Col lg={3}>
              <SelectInput2
                className="pt-12"
                keyValue="position"
                setValue={() => {
                  console.log(123);
                }}
                value={0}
                data={listPositionConvert}
              />
            </Col>
          </Row>
        </div>
      </Card>
      <Table
        columns={columns}
        dataSource={dataUserAccount.data}
        bordered
        onRow={(record, rowIndex) => {
          return {
            onDoubleClick: () => {
              setDataDetail(record);
              setIsModalVisible(true);
            },
          };
        }}
      />
      <ModalInfo
        listPositionConvert={listPositionConvert}
        listWorkTypeConvert={listWorkTypeConvert}
        dataDetail={dataDetail}
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        setIsModalChangePassVisible={setIsModalChangePassVisible}
      />
      <ModalChangePass
        isModalVisible={isModalChangePassVisible}
        handleConfirmChangePass={handleConfirmChangePass}
        handleCancelChangePass={handleCancelChangePass}
      />
    </div>
  );
}
