
export default function EmbedApp() {


  // useEffect(() => {
  //   const username =
  //     new URLSearchParams(window.location.search).get("user") || "simplyyliam";

  //   axios
  //     .get(`${import.meta.env.VITE_BACKEND_API_BASE}/embed/${username}`)
  //     .then((res) => {
  //       console.log("SERVER DATA:", res.data);
  //       setCommits(res.data.totalCommits ?? res.data.totalContributions ?? 0);
  //     })
  //     .catch((err) => console.error(err));
  // }, [setCommits]);

  return (
    <div style={{height: "100%", width: "100%" }}>Hello world</div>
  );
}
