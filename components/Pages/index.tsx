import Component, { PageEl } from "@/components/Libs/Component";
import Copy from "@/components/Libs/Copy";
import Router from "next/router";
import Window from "@/components/Libs/Window";
import TextBox from "@/components/Libs/TextBox";
import Icon2Titles from "@/components/Libs/Icon2Titles";
import Icon3Titles from "@/components/Libs/Icon3Titles";
import WindowFloat from "../Libs/WindowFloat";
import "./css.module.css";
import Block from "./Block";

export default (p) => Component(p, Page);

const Page: PageEl = (
  props,
  state: {
    form: string;
    book: {
      title: string;
      author: string;
      country: string;
      imageLink: string;
      price: number;
      language: string;
      pages: number;
    };
    cart: Array<string>;
  },
  refresh,
  getProps
) => {
  getProps(async () => {
    let cart = localStorage.getItem("cart");
    if (cart) {
      state.cart = JSON.parse(cart);
    }
  });
  
  let styles = global.styles;
  let name = "خوش آمدید";
  let name2 = "books cart";
  let total_price = 0;

  if (!state.cart) {
    state.cart = [];
  }

  for (let title of state.cart) {
    let book = props.books.find((b) => b.title == title);
    if (book) {
      total_price += book.price * 0.9;
    }
  }

  // Function to send cart data to backend API
  async function addToCart(cart) {
    const res = await fetch("/api/addtocart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart }),
    });
    
    if (res.ok) {
      console.log("Cart data sent to backend");
    } else {
      console.error("Failed to send cart data");
    }
  }

  return (
    <div style={{ direction: "rtl", minHeight: "11vh" }}>
      <br-x />

      {state.form == "details" ? (
        <WindowFloat
          title="details"
          onclose={() => {
            delete state.form;
            refresh();
          }}
        >
          <f-c>
            <f-15>title: </f-15>
            <sp-2 />
            <f-15>{state.book.title}</f-15>
          </f-c>
          <f-c>
            <f-15>author: </f-15>
            <sp-2 />
            <f-15>{state.book.author}</f-15>
          </f-c>
          <f-c>
            <f-15>country: </f-15>
            <sp-2 />
            <f-15>{state.book.country}</f-15>
          </f-c>
          <f-c>
            <f-15>language: </f-15>
            <sp-2 />
            <f-15>{state.book.language}</f-15>
          </f-c>
          <f-c>
            <f-15>pages: </f-15>
            <sp-2 />
            <f-15>{state.book.pages}</f-15>
          </f-c>

          <g-b
            style={{
              backgroundColor: state.cart.includes(state.book.title)
                ? "rgb(225 72 38)"
                : "#39FF9C",
            }}
            onClick={() => {
              if (state.cart.includes(state.book.title)) {
                state.cart = state.cart.filter(
                  (bookname) => state.book.title != bookname
                );
              } else {
                state.cart.push(state.book.title);
              }
              localStorage.setItem("cart", JSON.stringify(state.cart));
              addToCart(state.cart); // Call API to send cart data
              state.form = null;
              refresh();
            }}
          >
            {state.cart.includes(state.book.title) ? (
              <f-13>remove from cart</f-13>
            ) : (
              <f-13>add to cart</f-13>
            )}
          </g-b>
        </WindowFloat>
      ) : null}

      <Window
        title={name2}
        style={{ minHeight: 200, margin: 10, width: "calc(100% - 20px)" }}
      >
        <f-cse style={{ width: "100%", height: 150 }}>
          <f-20
            style={{
              alignContent: "center",
              textAlign: "center",
              backgroundColor: "silver",
              width: 200,
              height: 30,
              borderRadius: 10,
              boxShadow: "10px",
            }}
          >
            total price : {total_price}
          </f-20>
          <f-20
            style={{
              alignContent: "center",
              textAlign: "center",
              backgroundColor: "silver",
              width: 200,
              height: 30,
              borderRadius: 10,
              boxShadow: "10px",
            }}
          >
            total books: {state.cart.length}
          </f-20>
        </f-cse>
      </Window>

      <Window
        title={name}
        style={{ minHeight: 200, margin: 10, width: "calc(100% - 20px)" }}
      >
        <w-cse style={{}}>
          {props.books.map((book) => {
            return <Block book={book} state={state} refresh={refresh} />;
          })}
        </w-cse>
      </Window>
    </div>
  );
};

export async function getServerSideProps(context) {
  var session = await global.SSRVerify(context);
  let books = await global.db.collection("books").find({}).toArray();

  for (let book of books) {
    book.imageLink =
      "https://cdn.ituring.ir/research/ex/books/" + book.imageLink;
  }

  return {
    props: {
      data: global.QSON.stringify({
        session,
        books,
      }),
    },
  };
}
