function SignOut({ logout }) {
  return (
    <button className="sign-out" onClick={() => logout()}>
      Out
    </button>
  );
}

export default SignOut;
