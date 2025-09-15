const DummyPage = () => {
  const testArr = ["Data1", "Data2", "Data3"];
  return (
    <>
      <div>
        {testArr.map((e) => {
          return <p>{e}</p>;
        })}
      </div>
    </>
  );
};

export default DummyPage;
