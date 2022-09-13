import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect, useState} from "react";
import ApiProject, {IProjectBody} from "@app/api/ApiProject";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {InputModal} from "@app/components/Modal/InputModal";
import {SelectInput} from "@app/components/Modal/SelectInput";
import ApiUser from "@app/api/ApiUser";
import {IUserLogin} from "@app/types";
import {notification} from "antd";
import {IMetadata} from "@app/api/Fetcher";
import {queryKeys} from "@app/utils/constants/react-query";
import {DateInput3} from "@app/components/Modal/DateInput3";
import moment from "moment";

interface ModalCreateProjectProps {
  isModalVisible: boolean;
  toggleModal: () => void;
}

export function ModalCreateProject({
  isModalVisible,
  toggleModal,
}: ModalCreateProjectProps): JSX.Element {
  const queryClient = useQueryClient();
  const defaultValue = {
    name: "",
    projectManager: 1,
    startDate: moment().format("YYYY-MM-DD"),
    endDate: moment().format("YYYY-MM-DD"),
    scale: 0,
    customer: "",
    technicality: "",
    use: "",
    description: "",
  };
  const [data, setData] = useState<IProjectBody>(defaultValue);

  const getUser = (): Promise<{data: IUserLogin[]; meta: IMetadata}> => {
    return ApiUser.getUserAccount();
  };
  const {data: dataUser} = useQuery(
    queryKeys.GET_LIST_USER_FOR_PROJECT,
    getUser
  );

  useEffect(() => {
    setData(defaultValue);
  }, [isModalVisible]);

  const createProjectMutation = useMutation(ApiProject.createProject);
  const handleCreateProject = (values: IProjectBody): void => {
    createProjectMutation.mutate(
      {
        name: values.name,
        projectManager: values.projectManager,
        startDate: values.startDate,
        endDate: values.endDate,
        scale: values.scale,
        customer: values.customer,
        technicality: values.technicality,
        use: values.use,
        description: values.description,
      },
      {
        onSuccess: () => {
          notification.success({
            duration: 1,
            message: "Thêm project thành công!",
          });
          queryClient.refetchQueries({
            queryKey: queryKeys.GET_LIST_PROJECT,
          });
          toggleModal();
        },
        onError: () => {
          notification.error({
            duration: 1,
            message: "Thêm project thất bại!",
          });
        },
      }
    );
  };

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-create-project">
        <InputModal
          className="inline"
          keyValue="name"
          label="Tên dự án:"
          placeholder="Tên dự án"
          value={data.name ?? ""}
          onChange={setData}
          required
        />
        <SelectInput
          className="inline"
          keyValue="projectManager"
          label="PM dự án:"
          value={data.projectManager}
          data={dataUser?.data.map((item) => {
            return {
              value: Number(item.id),
              label: item.fullName,
            };
          })}
          setValue={setData}
        />
        <DateInput3
          className="inline"
          keyValue="startDate"
          label="Bắt đầu:"
          onChange={setData}
          value={data.startDate ?? ""}
          disabledDate={(d) => {
            if (data.endDate !== moment().format("YYYY-MM-DD")) {
              return d.isBefore() || d.isAfter(moment(data.endDate));
            }
            return d.isBefore();
          }}
        />
        <DateInput3
          className="inline"
          keyValue="endDate"
          label="Kết thúc:"
          onChange={setData}
          value={data.endDate ?? ""}
          disabledDate={(d) =>
            d.isBefore() || d.isBefore(moment(data.startDate))
          }
        />
        <InputModal
          className="inline suffix"
          keyValue="scale"
          label="Quy mô:"
          placeholder="Quy mô"
          value={data.scale + ""}
          onChange={setData}
          suffix="man/month"
        />
        <InputModal
          className="inline"
          keyValue="customer"
          label="Khách hàng:"
          placeholder="Khách hàng"
          value={data.customer ?? ""}
          onChange={setData}
        />
        <InputModal
          className="inline"
          keyValue="use"
          label="Công cụ sử dụng:"
          placeholder="Công cụ sử dụng"
          value={data.use ?? ""}
          onChange={setData}
        />
        <InputModal
          className="inline"
          keyValue="technicality"
          label="Kỹ thuật:"
          placeholder="Kỹ thuật"
          value={data.technicality ?? ""}
          onChange={setData}
        />
        <InputModal
          className="inline"
          keyValue="description"
          label="Mô tả:"
          placeholder="Mô tả"
          value={data.description ?? ""}
          onChange={setData}
        />
      </div>
    );
  };

  return (
    <ModalCustom
      isModalVisible={isModalVisible}
      handleOk={() => {
        handleCreateProject(data);
      }}
      handleCancel={toggleModal}
      title="Thêm dự án"
      content={renderContent()}
    />
  );
}
