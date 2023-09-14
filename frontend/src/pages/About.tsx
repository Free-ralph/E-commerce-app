const About = () => {
  return (
    <div className="flex h-[70vh] w-[90%] m-auto font-bold text-lg flex-col">
      <div className="m-auto text-center">
        <p className="text-primary mb-4">
          Hi There, i'm Chidera Okosa, the author of this project, click on the
          link below to know more about me
        </p>
        <a
          target="blank"
          href="https://okosa.pythonanywhere.com"
          className="text-secondary bg-pink-400 rounded px-4 py-2 mt-3 cursor-pointer border-primary hover:bg-primary transition-all delay-75"
        >
          My website
        </a>
      </div>
    </div>
  );
};

export default About;
