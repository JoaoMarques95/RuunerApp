import React from "react";
import { Link } from "react-router-dom";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { routes: null };
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <img
          className="navbar-brand"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAnFBMVEX/8gAAAAD/9AD/9gD/+AD/+gD//AD//QDp3QDe0wD//wDTyADs4AD98ACxqAD57ACmnQDYzQBkXwDEugB4cgA7OAAoJgBMSACflwDj1wBAPQCHgAAzMADCuAC6sQDz5gBybACYkABfWgAgHwBVUQAbGgAsKgAWFQBGQgCAeQCSigAPDgA8OQBsZwB1bwDNwwC1qwAxLgAeHAAREQBUYX81AAAH90lEQVR4nO2dbXOyOhCGZZMgKAoW39AqvtW29lFs+///2wEEjUDQ55x2THL2+tQ67UzuSbK72d3ERgNBEARBEARBEARBEARBEARBEARBEARBEARBEOTXACAxAI8ex69BGpYdEzixykeP5Vdgvd2bEfOy8iIt59H0t0bO8Mkljx7PjwNzg2dr6yYRnMmVQuPgarZQ6dgooNskmkWBxpg+ekw/CoQlhTu9FBK/pHCpl0LaLSl8Z48e1I9CvZLCkfnoQf0odF5SaDQfPagfpcLSGF29NmJzW1I4crTy+WWPbwwCrRSSoKTQ08uYgjUpKuxoNYVx5D0qCFzrZUsbxP4oKFzotUgJLHR2FkDM3r5kaHqanJ6S9FroXzvDj+3w9WOjhzcECoEdFObvuxtFs3nw6LH9CLTjbSZ/Sm6i32JUi3wiwPy1tPtStn5INVBI3PKJ6cyT31BbYmxfWFg2nxyvU5VzbQTCwF7W6UvYKOsPCZ0tn4a39MVESjpEANPef98hz1A0UUM61uo+eTF79RTG87f7ulugcVBNIbBw93y/PvWS3uCW8xT1hGq5C+js/lLgs2InYOoXT7i3UCyrD6UIZrg51O9KxaprxObGvt30vWPkdjY6KczrEivP79mB41JKSPtTJ4Xm4DTsbjNtmEmsJD3WClRNITuN+mV2GXZFuUlhhZBltCdcop7c8I/XgXd83pLaPeYF0P2lJghuv17hkfMWpOEEttSZG5a5e+8yanBuxOBcvpTau9GrsT1K7CFZNl9cIAbW271zSKPMTkl87Gcnf88XriFY1ys8W5rLX07lPW1kCq+2li0Wl/DiU5Z4TUpbs/yzlbzL9KTwI+DM4y2FH8+r/nLuR/Nxf5B/tpF3mbJDMsCrVjUS1SusYiSxwvdkgB7v4W45/CokbpNiU+M6oMk++hsm4568U3jqQ3iz+AGaxZpvxqH80Xr0tIuIKXUtI41pVldhmCmoWdiFuR28e75DmczqEkhi8PdXbVytaoGrMHy6/Ladti1X6rnLIe14uH3eX4ucRZcCna9Gfyaj1XTuNpkqdxNIzyhEJAJT+tyOlzKljh2ETPqVyVNWaJY6E06L9DRlAIpM3ZnUvfOrlAR/KhWqlgU+k65Jvg5R0TGbomx7gpmcntb+eYKAN5gcL6p2zUKYuvf1OfJmgpBN2UVK/NMJL09jC88VynYJ5btukC1CJijhDyxVtyEsTwq+M4XlNr0TO3UbLrNE1CQ3JK3qsFvdZr28xTnfh7R8fyRh21Z1GzYgOHx+f3zlxydwqtNsK9UCGQ7C2vO5n6d0RRULiVNpd5BeYT79CO57tUI1G2gqAEtQGm09emQ/hcjfrxQr3IsRKVyHyjqLAumBv4phW11bekV6HK7k2Vfamp6pyee/9rSQCIG4ue11psNCFR1/Uz5nOswiqStZvNoaWFQI63qFhurG3xeo0JomvAXqSyRWnUJjIvdlC6D05gDZjUaTlcRltAYJj173xgDhRs+e1OkMaiWDf6o/JZDezW7oo6w+I7+vXJ/3vNWzlyBpXpH0sraJ59q2u3tK+BP5DCokN0HPq++9Iy6NQeOelu93qawNEEpcq80nJ/aWKzKptVHbBXm62IAwt30c9wsdv+vp0WKVK63i6n0V37JMIiWzxaa6n/nt4LcqJhICQZNCgZ0chSgQFAIzhl2rpLF8PjxWNmJ+z2QwNlXvylwz6QaFgnzpf7ZWx6vykCNLAonsjqtok0PUaZrm+fYyK6ZLpx0Ap6oc9eY+3trEEebX22K53G8Gn5PNajP4MIyXxWH0UhzscLTw2laatm8W7h9+Jt4dTOu9/ETNOnq4tQHr6Dsmpcy120GHub255/kN0/HHVfZy6zmk/JxQVq8Bs70cFP9DgooiZGsP0ndHY8dIkw/i3yy/Krze2KZZ7NE/39omDcsrmlnv8etUBJCmfSivO6MfXReeXvgIFCjzN1fV076sIXgKIW1BDYafpMLFe+rOeesl+2Vg4kaCJsucfekkCDTkInOJm2ZPAGnN624djJoVloRwFVQV+k+o4wkvV1b7dP46zU7yVZoCpOJ9nRRR4jDv3VBgH2aQZq9yO7YFw+eOyCs5wu/bELdb1jgWjZ5T+KyKwnipOsuCwL4wocZ3LipUGAYWTvlwdRMKTw58qkqpDhQwfS5/EYn9AJlfgnNJk24iSHhef3XhGPEvFUaJA9NK4qXaT9+mWdW9CUHalwOxek/vAUTLxdO49vjOP6Io8X01EckTdOEN+0EvwfdWyU6pm/aRz4qrthHvA9yLwqm8daj/Arsk/t8en8j4DbLu/hQd6voVkNk5Y6N226kQgPNVyxdtujKvAXZ+tU7Pjci3uyv2ntLdQCO/L/uk50ZMum6yhNSnptaUu/+l7k2TGwBkCuWq6f8kLCtxfOn1HQIc53dbpKgG/wbQycypMjnFv4ZEmdtX7JXI+4FGlrpSIrn/r8i7GiYyNC38Dq2zw9D2ax/zo/C73dbTK14u2Ay2/ZaOEq/a/PoafrNl4XnFfWQmuxEIZYzpMqF0zleQh/2Z22LObDztT3U5GNc85KpQ4a0OYpcapf43CpV7s12A8OrCSJdYVaRwo9YrvDUIVulCXCNXjaorRMOFrY03bJQfWPxaeFH1JQBVASfZiJNpZNu23/XtICRa6WskLRzNZtNkycsahBJVHuFDEARBEARBEARBEARBEARBEARBEARBEAT53/EP+xlr8iVSug8AAAAASUVORK5CYII="
          height="3%"
          width="3%"
        />
        {/*Toogle*/}
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto ">
            <Link to="/New-Route">
              <li className=" nav-item active">
                <a className="nav-link" href="#">
                  New Route <span className="sr-only">(current)</span>
                </a>
              </li>
            </Link>
            <Link to="/Last-Routes">
              <li className="nav-item active">
                <a className="nav-link" href="#">
                  Latest Routes <span className="sr-only">(current)</span>
                </a>
              </li>
            </Link>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <button
              className="btn btn-outline-success mr-sm-2 my-sm-0 btn btn-outline-warning"
              type="submit"
            >
              Login
            </button>
            <button
              className="btn btn-outline-success my-2 my-sm-0 btn btn-outline-warning"
              type="submit"
            >
              Register
            </button>
          </form>
        </div>
      </nav>
    );
  }
}

export default Menu;
