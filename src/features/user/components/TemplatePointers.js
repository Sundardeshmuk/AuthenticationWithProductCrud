let user;
const userString = localStorage.getItem("user");
if (userString !== null && userString !== undefined) {
  try {
    user = JSON.parse(userString);
  } catch (error) {
    localStorage.clear();
    window.location.href = "/app/login";
  }
} else {
  localStorage.clear();
}

function TemplatePointers() {
  return (
    <>
      <h2 className="text-xl mt-6 font-bold">About the Developer</h2>
      <p className="py-2 mt-2 mb-3">
        My name is <span className="font-bold">Sunder Deshmukh</span>, and I'm a
        Software Engineer from Maharashtra. I am currently completing an
        assignment on ETL Hive for a full stack developer role.
      </p>
      {user ? (
        <>
          <h2>
            Welcome <span className="font-bold">{user?.name}</span>
          </h2>
          <p>
            Your email id is <span className="font-bold">{user?.email}</span>
          </p>
          <p>
            In this Authentication Application here we have feature of dark mode
            and light mode, notification we add future, and profile setting to
            update , for now I have not integrate the api for profile and all,
            just created the ui
          </p>
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default TemplatePointers;
