import React, {useEffect, useState} from "react";
import {EnglishCertificate, EUserGender, IUserLogin} from "@app/types";
import {useMutation, useQuery, useQueryClient} from "react-query";
import ApiUser, {IProfileBody, IRegisterAccountBody} from "@app/api/ApiUser";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Tabs,
} from "antd";
import {CameraFilled} from "@ant-design/icons";
import {queryKeys} from "@app/utils/constants/react-query";
import moment from "moment/moment";
import {formatCurrencyVnd} from "@app/utils/convert/ConvertHelper";
import {defaultValidateMessages, layout} from "@app/validate/user";

export function ProfileAccount(): JSX.Element {
  const [toggleModalUpload, setToggleModalUpload] = useState(false);
  const [fileUpload, setFileUpload] = useState();
  const [form] = Form.useForm();

  const getMeData = (): Promise<IUserLogin> => {
    return ApiUser.getMe();
  };

  const queryClient = useQueryClient();

  const {
    data: dataUser,
    isLoading,
    refetch,
  } = useQuery(queryKeys.GET_DATA_USER_IN_USE, getMeData) || {};

  const [typeCertificateEnglish, setTypeCertificateEnglish] =
    useState<EnglishCertificate>(dataUser?.englishCertificate || "");

  const dataRefetch = (): void => {
    refetch();
  };

  const onFileUpload = (): void => {
    if (!fileUpload) {
      notification.error({
        duration: 1,
        message: `Chưa chọn ảnh mới`,
      });
    } else {
      const formData = new FormData();
      formData.append("file", fileUpload);
      ApiUser.updateAvatar(formData)
        .then((response) => {
          notification.success({
            duration: 1,
            message: `Sửa thành công`,
          });
          setToggleModalUpload(false);
          setFileUpload(undefined);
          dataRefetch();
          queryClient.refetchQueries({
            queryKey: "dataUser",
          });
        })
        .catch((error) =>
          notification.warning({
            duration: 1,
            message: `Sửa thất bại`,
          })
        );
      setToggleModalUpload(false);
      setFileUpload(undefined);
    }
  };

  const handleChooseFile = (e: any): void => {
    const img = e.target.files[0];
    setFileUpload(img);
  };

  const updateProfile = useMutation(ApiUser.updateMe, {
    onSuccess: (data) => {
      notification.success({
        duration: 1,
        message: `Sửa thành công`,
      });
      dataRefetch();
    },
    onError: () => {
      notification.error({
        duration: 1,
        message: `Sửa thất bại`,
      });
    },
  });

  const handleConfirmEdit = (data: IProfileBody): void => {
    Modal.confirm({
      title: "Xác nhận sửa thông tin nhân viên?",
      okType: "primary",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: () => {
        handleUpdateProfile(data);
      },
      onCancel: () => {
        cancelUpdate();
      },
    });
  };

  const handleUpdateProfile = (values: IProfileBody): void => {
    updateProfile.mutate(values);
  };

  const onFinish = (fieldsValue: IRegisterAccountBody): void => {
    const data = {
      fullName: fieldsValue?.fullName,
      email: fieldsValue?.email,
      dateOfBirth: fieldsValue?.dateOfBirth,
      personId: fieldsValue?.personId,
      address: fieldsValue?.address,
      phoneNumber: fieldsValue?.phoneNumber,
      phoneNumberRelative: fieldsValue?.phoneNumberRelative,
      gender: fieldsValue?.gender,
      workRoom: fieldsValue?.workRoom,
      englishCertificate: fieldsValue?.englishCertificate,
      englishScore: Number(fieldsValue?.englishScore),
    };
    handleConfirmEdit(data);
  };

  const cancelUpdate = (): void => {
    const date = dataUser?.dateOfBirth && new Date(dataUser?.dateOfBirth);
    setTypeCertificateEnglish(dataUser?.englishCertificate || "");
    form.setFieldsValue({
      fullName: dataUser?.fullName,
      email: dataUser?.email,
      dateOfBirth: moment(date, "DD/MM/YYYY"),
      personId: dataUser?.personId,
      address: dataUser?.address,
      phoneNumber: dataUser?.phoneNumber,
      phoneNumberRelative: dataUser?.phoneNumberRelative,
      gender: dataUser?.gender,
      workRoom: dataUser?.workRoom,
      englishCertificate: dataUser?.englishCertificate,
      englishScore: dataUser?.englishScore,
    });
  };

  useEffect(() => {
    cancelUpdate();
  }, [dataUser]);

  const handleChangeCertificate = (value: {
    value: EnglishCertificate;
    label: React.ReactNode;
  }) => {
    setTypeCertificateEnglish(value.value);
    if (form.getFieldValue("englishCertificate") === "") {
      form.setFieldValue("englishScore", "");
    }
  };

  const contentDetail = (): JSX.Element => {
    return (
      <div className="profile flex flex-col justify-between">
        <div className="profile-detail-information">
          <div className="information-detail mt-10">
            <Row>
              <Col span="12">
                <p>
                  <span>Giới tính: </span>
                  <span>
                    {dataUser?.gender && EUserGender[dataUser?.gender]}
                  </span>
                </p>
                <p>
                  <span>Vị trí: </span>
                  <span>{dataUser?.workType?.name}</span>
                </p>
                <p>
                  <span>Số điện thoại: </span>
                  <span>{dataUser?.phoneNumber}</span>
                </p>
                <p>
                  <span>Số điện thoại người thân: </span>
                  <span>{dataUser?.phoneNumberRelative}</span>
                </p>
                <p>
                  <span>Email: </span>
                  <span>{dataUser?.email}</span>
                </p>
              </Col>
              <Col span="12">
                <p>
                  <span>Ngày sinh: </span>
                  <span>
                    {moment(dataUser?.dateOfBirth).format("DD-MM-YYYY")}
                  </span>
                </p>
                <p>
                  <span>CMND/CCCD: </span>
                  <span>{dataUser?.personId}</span>
                </p>
                <p>
                  <span>Địa chỉ: </span>
                  <span>{dataUser?.address}</span>
                </p>
                <p>
                  <span>Phòng làm việc: </span>
                  <span>{dataUser?.workRoom}</span>
                </p>
                <p>
                  <span>Chứng chỉ ngoại ngữ: </span>
                  <span>{dataUser?.englishCertificate}</span>
                </p>
                <p>
                  <span>Điểm Chứng chỉ: </span>
                  <span>{dataUser?.englishScore}</span>
                </p>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  };

  const contentUpdate = (): JSX.Element => {
    return (
      <Form
        form={form}
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        validateMessages={defaultValidateMessages}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[
                {required: true},
                {whitespace: true},
                {
                  pattern:
                    /^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/,
                  message: "Họ và tên không đúng định dạng!",
                },
                {min: 1},
                {max: 30},
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="gender" label="Giới tính">
              <Select>
                <Select.Option key="1" value="Male">
                  Nam
                </Select.Option>
                <Select.Option key="2" value="Female">
                  Nữ
                </Select.Option>
                <Select.Option key="3" value="Other">
                  Khác
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[
                {
                  pattern: /^(?:\d*)$/,
                  message: "Số điện thoại không đúng định dạng!",
                },
                {min: 10},
                {max: 11},
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phoneNumberRelative"
              label="Số điện thoại người thân"
              rules={[
                {
                  pattern: /^(?:\d*)$/,
                  message: "Số điện thoại không đúng định dạng!",
                },
                {min: 10},
                {max: 11},
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="englishCertificate" label="Chứng chỉ ngoại ngữ">
              <Select onChange={handleChangeCertificate}>
                <Select.Option key="1" value="Toeic">
                  Toeic
                </Select.Option>
                <Select.Option key="2" value="Toefl">
                  Toefl
                </Select.Option>
                <Select.Option key="3" value="Ielts">
                  Ielts
                </Select.Option>
                <Select.Option key="3" value="Other">
                  Khác
                </Select.Option>
                <Select.Option key="0" value="">
                  Không
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="dateOfBirth" label="Ngày sinh">
              <DatePicker
                format="DD/MM/YYYY"
                disabledDate={(current) => {
                  const customDate = moment().format("DD/MM/YYYY");
                  return current && current > moment(customDate, "DD/MM/YYYY");
                }}
              />
            </Form.Item>
            <Form.Item
              name="personId"
              label="CMND/CCCD"
              rules={[
                {
                  pattern: /^(?:\d*)$/,
                  message: "CMND/CCCD không đúng định dạng!",
                },
                {min: 12},
                {max: 13},
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ">
              <Input />
            </Form.Item>
            <Form.Item name="workRoom" label="Phòng làm việc">
              <Input />
            </Form.Item>
            <Form.Item name="englishScore" label="Điểm chứng chỉ">
              <Input
                disabled={
                  !form.getFieldValue("englishCertificate") ||
                  typeCertificateEnglish === ""
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Form.Item className="w-100x">
            <div className="footer-form">
              <Button
                className="button-cancel mr-3"
                onClick={(): void => {
                  cancelUpdate();
                }}
              >
                Hủy
              </Button>
              <Button
                className="button-confirm"
                type="primary"
                htmlType="submit"
              >
                Xác Nhận
              </Button>
            </div>
          </Form.Item>
        </Row>
      </Form>
    );
  };

  return (
    <div className="profile-page">
      <Image
        preview={false}
        height="250px"
        style={{objectFit: "cover"}}
        width="100%"
        fallback="/img/background-login.png"
        src="/img/background-login.png"
      />
      <div className="wrapper">
        <Row gutter={12}>
          {" "}
          <Col span="8">
            <Card
              bordered={false}
              className="card-left"
              style={{borderRadius: "10px"}}
              loading={isLoading}
            >
              <div className="text-center">
                <Modal
                  title="Sửa ảnh đại diện"
                  centered
                  visible={toggleModalUpload}
                  className="modal"
                  footer={[
                    <Button
                      key="save"
                      style={{backgroundColor: "#40a9ff"}}
                      type="primary"
                      className="btn-action m-1 hover-pointer"
                      onClick={onFileUpload}
                    >
                      Lưu
                    </Button>,
                  ]}
                  onCancel={(): void => setToggleModalUpload(false)}
                >
                  <div className="m-2 d-flex">
                    <p className="ml-2 font-bold w-20x">Thêm ảnh</p>
                    <Input
                      type="file"
                      className="input w-100x"
                      onChange={handleChooseFile}
                      placeholder="abc"
                      style={{
                        width: "100px",
                      }}
                    />
                  </div>
                </Modal>
                <div className="profile-avatar-user">
                  <Image
                    width="180px"
                    height="180px"
                    preview={false}
                    style={{borderRadius: "50%", objectFit: "cover"}}
                    fallback="/img/avatar/avatar.jpg"
                    src={dataUser?.avatar || "/img/avatar/avatar.jpg"}
                  />
                  <div className="button-update-avatar">
                    <CameraFilled
                      onClick={(): void => setToggleModalUpload(true)}
                      className="icon-update-avatar"
                    />
                  </div>
                </div>
              </div>
              <h4 className="text-center">{dataUser?.fullName}</h4>
              <p className="text-center position-user-text">
                {dataUser?.position?.name}
              </p>
              <div className="profile-salary-account">
                <p>
                  <span>Mã nhân viên: </span>
                  <span>{dataUser?.employeeCode}</span>
                </p>
                <p>
                  <span>Lương cơ bản: </span>
                  <span>
                    {dataUser?.baseSalary &&
                      formatCurrencyVnd(Number(dataUser?.baseSalary))}
                  </span>
                </p>
                <p>
                  <span>Khấu trừ gia cảnh: </span>
                  <span>
                    {dataUser?.deductionOwn &&
                      formatCurrencyVnd(Number(dataUser?.deductionOwn))}
                  </span>
                </p>
              </div>
            </Card>
          </Col>
          <Col span="16">
            <Card
              bordered={false}
              className="card-right"
              style={{borderRadius: "10px"}}
              loading={isLoading}
            >
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Thông tin chung" key="1">
                  <div className="tab-detail-profile">{contentDetail()}</div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Cập nhật thông tin" key="2">
                  <div className="tab-update-profile mt-5">
                    {contentUpdate()}
                  </div>
                </Tabs.TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>
      {/* <ModalUpdateProfile */}
      {/*  isModalVisible={toggleModal} */}
      {/*  dataRefetch={dataRefetch} */}
      {/*  setToggleModal={setToggleModal} */}
      {/*  dataProfile={dataUser || null} */}
      {/* /> */}
    </div>
  );
}
