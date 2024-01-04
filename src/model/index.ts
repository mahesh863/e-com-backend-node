import { sequelizeConnection } from '../config';

import Order from './order.model';
import Category from './category.model';
import Company from './company.model';
import Image from './image.mode';
import OrderStatus from './orderStatus.model';
import Product from './product.model';
import Review from './review.model';
import Tag from './tag.model';
import User from './user.model';
import Collection from './collection.model';
import Banner from './banner.model';
import Cart from './cart.model';
import WidgetType from './widgetType.model';
import Widget from './widget.model';
import Home from './home.model';
import CategoryWidget from './categoryWidget.model';
import OrderItems from './orderItems.model';
import Address from './address.model';

Product;
User;
Image;
Review;
Category;
Company;
Tag;
OrderStatus;
Order;
Collection;
Banner;
Cart;
WidgetType;
Widget;
Home;
CategoryWidget;
OrderItems;
Address;

// sync database
const initializeDb = async () => await sequelizeConnection.sync({ force: false, logging: false, alter: true });

export default initializeDb;
