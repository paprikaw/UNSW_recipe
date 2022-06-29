import { React } from "react";
import useCollapse from "react-collapsed";
import { Card, Button, Spin, Space } from "antd";
import SelectButton from "./selectButton";
import "./index.scss";

function CollapseBox(props) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
    collapsedHeight: "80",
  });
  const newDic = {};
  const { data, title, selectState, setSelectState } = props;
  data.map((name) => (newDic[name] = false));

  return (
    <Card
      title={title}
      hoverable={true}
      class={"collapse-card"}
      style={{ margin: "0 auto" }}
      actions={[
        <Button {...getToggleProps()} type="link">
          {isExpanded ? "Collapse" : "Expand"}
        </Button>,
      ]}
    >
      <div style={{ height: "300px" }} {...getCollapseProps()}>
        <Space size={[8, 16]} wrap>
          {selectState ? (
            data.map((name) => {
              return (
                <SelectButton
                  selectState={selectState}
                  setSelectState={setSelectState}
                  buttonText={name}
                  categoryKey={title}
                />
              );
            })
          ) : (
            <Spin tip="Loading..." />
          )}
        </Space>
      </div>
    </Card>
  );
}

export default CollapseBox;
