:root{

  --miku-blue:#39C5BB;
  --miku-light:#7FF7EE;
  --miku-pink:#FF5AAE;

  --bg:#EAFDFC;
  --bg2:#D7F8F5;

  --white:#FFFFFF;

  --text:#1A2730;
  --text-light:#6E7D89;

}

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:'Inter',sans-serif;
}

html{
  scroll-behavior:smooth;
}

body{

  min-height:100vh;

  background:

  radial-gradient(
  circle at top left,
  rgba(57,197,187,.25),
  transparent 30%
  ),

  radial-gradient(
  circle at bottom right,
  rgba(255,90,174,.18),
  transparent 30%
  ),

  var(--bg);

  color:var(--text);

  display:flex;

}

/* SIDEBAR */

.sidebar{

  width:280px;

  min-height:100vh;

  background:
  rgba(255,255,255,.6);

  backdrop-filter:blur(18px);

  border-right:
  1px solid rgba(57,197,187,.2);

  padding:25px;

  display:flex;
  flex-direction:column;
  justify-content:space-between;

  transition:.4s;

}

.sidebar.collapsed{

  width:90px;

}

.sidebar.collapsed .logo-text,
.sidebar.collapsed nav button{

  font-size:0;

}

.sidebar.collapsed nav button{

  justify-content:center;

}

.logo{

  display:flex;
  align-items:center;
  gap:15px;

  margin-bottom:25px;

}

.logo-circle{

  width:60px;
  height:60px;

  border-radius:50%;

  background:

  linear-gradient(
  135deg,
  var(--miku-blue),
  var(--miku-pink)
  );

  box-shadow:
  0 0 25px rgba(57,197,187,.35);

}

.logo h2{

  color:var(--miku-blue);

  font-size:1.2rem;

}

.logo span{

  color:var(--text-light);

}

#toggleBtn{

  width:100%;

  border:none;

  padding:12px;

  border-radius:14px;

  cursor:pointer;

  background:var(--miku-blue);

  color:white;

  margin-bottom:20px;

}

nav{

  display:flex;
  flex-direction:column;
  gap:10px;

}

nav button{

  border:none;

  background:white;

  padding:15px;

  border-radius:16px;

  cursor:pointer;

  text-align:left;

  transition:.3s;

  color:var(--text);

}

nav button:hover{

  transform:translateX(5px);

}

nav button.active{

  background:var(--miku-pink);

  color:white;

}

.stats{

  display:flex;
  flex-direction:column;
  gap:15px;

}

.stat{

  background:
  rgba(255,255,255,.8);

  border:
  1px solid rgba(57,197,187,.15);

  padding:20px;

  border-radius:20px;

}

.stat span{

  color:var(--text-light);

}

.stat h3{

  color:var(--miku-blue);

  margin-top:10px;

  font-size:2rem;

}

/* MAIN */

main{

  flex:1;

  padding:50px;

  overflow-y:auto;

}

/* HERO */

.hero{

  position:relative;

  min-height:350px;

  display:flex;

  flex-direction:column;

  justify-content:center;

}

.bg-title{

  position:absolute;

  top:-80px;
  right:0;

  font-size:18rem;

  font-weight:900;

  color:
  rgba(57,197,187,.08);

  pointer-events:none;

}

.hero h1{

  font-size:6rem;

  font-weight:900;

  color:var(--miku-blue);

  text-shadow:
  0 0 30px rgba(57,197,187,.2);

}

.hero h2{

  font-size:4rem;

  color:var(--miku-pink);

  margin-top:-10px;

}

.hero p{

  margin-top:15px;

  color:var(--text-light);

  font-size:1.1rem;

}

/* SEARCH */

.search-area{

  margin:30px 0;

}

#search{

  width:100%;

  padding:18px;

  border:none;

  border-radius:18px;

  background:white;

  outline:none;

  font-size:1rem;

  box-shadow:
  0 10px 30px rgba(57,197,187,.08);

}

/* FEATURED */

#featured{

  margin-bottom:40px;

}

.featured-card{

  background:

  linear-gradient(
  135deg,
  rgba(57,197,187,.15),
  rgba(255,90,174,.1)
  );

  border:
  1px solid rgba(57,197,187,.2);

  border-radius:30px;

  padding:40px;

  display:flex;
  justify-content:space-between;
  align-items:center;

  gap:20px;

}

.featured-card h2{

  font-size:3rem;

  color:var(--miku-blue);

}

.featured-card p{

  margin-top:15px;

  color:var(--text-light);

}

.featured-card button{

  border:none;

  padding:15px 25px;

  border-radius:16px;

  background:var(--miku-pink);

  color:white;

  cursor:pointer;

}

/* SECTION */

.section-title{

  margin-bottom:25px;

}

.section-title h3{

  color:var(--miku-blue);

  font-size:2rem;

}

/* CARDS */

.cards{

  display:grid;

  grid-template-columns:
  repeat(auto-fill,minmax(320px,1fr));

  gap:25px;

}

.project{

  background:
  rgba(255,255,255,.75);

  backdrop-filter:blur(12px);

  border:
  1px solid rgba(57,197,187,.15);

  border-radius:24px;

  overflow:hidden;

  transition:.3s;

}

.project:hover{

  transform:translateY(-8px);

  box-shadow:
  0 20px 40px rgba(57,197,187,.15);

}

.project-banner{

  height:140px;

  background:

  linear-gradient(
  135deg,
  var(--miku-blue),
  var(--miku-pink)
  );

}

.project-content{

  padding:20px;

}

.project-content h3{

  color:var(--miku-blue);

  margin-bottom:10px;

}

.project-content p{

  color:var(--text-light);

  margin-bottom:15px;

}

.tags{

  display:flex;
  gap:8px;

  flex-wrap:wrap;

}

.tags span{

  background:
  rgba(57,197,187,.15);

  color:var(--miku-blue);

  padding:6px 12px;

  border-radius:999px;

  font-size:.8rem;

}

.open-btn{

  width:100%;

  margin-top:20px;

  border:none;

  padding:14px;

  border-radius:14px;

  cursor:pointer;

  background:var(--miku-pink);

  color:white;

  font-weight:600;

}

/* RESPONSIVO */

@media(max-width:900px){

  body{

    flex-direction:column;

  }

  .sidebar{

    width:100%;
    min-height:auto;

  }

  .hero h1{

    font-size:3.5rem;

  }

  .hero h2{

    font-size:2rem;

  }

  .bg-title{

    display:none;

  }

  main{

    padding:25px;

  }

}
