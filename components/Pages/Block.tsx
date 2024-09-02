export default (props) => {
  
  let book = props.book;

  if (!props.state.cart) {
    props.state.cart = [];
  }

  return (
    <c-x
      onClick={() => {
        props.state.form = "details";
        props.state.book = book;
        props.refresh();
      }}
      style={{
        border: "1px solid #ccc",
        borderRadius: "5px 5px 5px 0px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <img
        className={global.styles.hoverzoom_light}
        src={book.imageLink}
        style={{
          height: 200,
          width: 150,
          objectFit: "fill",
        }}
      />

      <f-cc
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          paddingTop: 10,
        }}
      >
        <f-8 style={{ fontFamily: "wonder" }}>{book.title}</f-8>
        <f-csb style={{ width: "100%" }}>
          {props.state.cart.includes(props.book.title) ? (
            <img
              src="https://cdn.turing.team/research/33/checked.png"
              alt=""
              style={{
                objectFit: "contain",
                height: 20,
                width: 20,
                marginRight: 5,
              }}
            />
          ) : (
            <img
              src="https://cdn.turing.team/research/33/trolley.png"
              style={{
                objectFit: "contain",
                height: 20,
                width: 20,
                marginRight: 5,
              }}
            />
          )}
          <c-cc
            style={{
              display: "flex",
              alignItems: "end",
              padding: 10,
              width: "100%",
            }}
          >
            <del style={{ fontSize: 10 }}>$ {book.price}</del>
            <f-13b>$ {book.price * 0.9}</f-13b>
          </c-cc>
        </f-csb>
      </f-cc>
    </c-x>
  );
};
