--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (165f042)
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP INDEX IF EXISTS public."IDX_session_expire";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_unique;
ALTER TABLE IF EXISTS ONLY public.settings DROP CONSTRAINT IF EXISTS settings_pkey;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.schedule_events DROP CONSTRAINT IF EXISTS schedule_events_pkey;
ALTER TABLE IF EXISTS ONLY public.rsvps DROP CONSTRAINT IF EXISTS rsvps_pkey;
ALTER TABLE IF EXISTS ONLY public.registry_items DROP CONSTRAINT IF EXISTS registry_items_pkey;
ALTER TABLE IF EXISTS ONLY public.photos DROP CONSTRAINT IF EXISTS photos_pkey;
ALTER TABLE IF EXISTS ONLY public.guest_messages DROP CONSTRAINT IF EXISTS guest_messages_pkey;
ALTER TABLE IF EXISTS ONLY public.couple_info DROP CONSTRAINT IF EXISTS couple_info_pkey;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.settings;
DROP TABLE IF EXISTS public.sessions;
DROP TABLE IF EXISTS public.schedule_events;
DROP TABLE IF EXISTS public.rsvps;
DROP TABLE IF EXISTS public.registry_items;
DROP TABLE IF EXISTS public.photos;
DROP TABLE IF EXISTS public.guest_messages;
DROP TABLE IF EXISTS public.couple_info;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: couple_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.couple_info (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    bride_name character varying NOT NULL,
    groom_name character varying NOT NULL,
    bride_photo text,
    groom_photo text,
    our_story text,
    wedding_date timestamp without time zone NOT NULL,
    hero_image text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: guest_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guest_messages (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    guest_name character varying NOT NULL,
    message text NOT NULL,
    approved boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: photos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.photos (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    url text NOT NULL,
    caption text,
    category character varying DEFAULT 'gallery'::character varying NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: registry_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.registry_items (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    description text,
    price integer,
    image_url text,
    purchase_url text,
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: rsvps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rsvps (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    guest_name character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying,
    attending boolean NOT NULL,
    guest_count integer DEFAULT 1 NOT NULL,
    meal_preference character varying,
    special_requirements text,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: schedule_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schedule_events (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title character varying NOT NULL,
    description text,
    event_time timestamp without time zone NOT NULL,
    location character varying,
    icon character varying,
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    venue_name character varying,
    venue_address text,
    venue_latitude text,
    venue_longitude text,
    background_music_url text,
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Data for Name: couple_info; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.couple_info (id, bride_name, groom_name, bride_photo, groom_photo, our_story, wedding_date, hero_image, created_at, updated_at) FROM stdin;
081ac074-3881-48be-a5c7-3412955ed3f5	Nguyễn Thu Hà	Trần Minh Tuấn	/attached_assets/generated_images/Elegant_bride_portrait_photo_6abee8e2.png	/attached_assets/generated_images/Handsome_groom_portrait_photo_1678e40a.png	Chúng tôi gặp nhau lần đầu vào một buổi chiều mùa xuân tại công viên Hoàn Kiếm. Từ cái nhìn đầu tiên, chúng tôi biết rằng đây là định mệnh. Sau 3 năm yêu nhau, chúng tôi quyết định bước vào cuộc sống hôn nhân, cùng nhau xây dựng tổ ấm hạnh phúc.	2025-12-25 14:00:00	/attached_assets/generated_images/Romantic_wedding_couple_hero_background_0afd25e7.png	2025-10-23 18:57:55.528337	2025-10-23 18:57:55.528337
\.


--
-- Data for Name: guest_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.guest_messages (id, guest_name, message, approved, created_at) FROM stdin;
bdd688f4-5f90-4265-8442-3a375e5f85e0	Phạm Văn Nam	Chúc hai bạn trăm năm hạnh phúc, bên nhau suốt đời!	t	2025-10-23 18:58:10.31665
97c22659-63ab-4619-96d1-0b308c555c37	Lê Thị Hương	Chúc mừng đám cưới của hai bạn! Hạnh phúc mãi mãi nhé!	t	2025-10-23 18:58:10.31665
036a3adf-9b93-4d67-840b-b2c88de501fa	Nguyễn Quốc Anh	Chúc cho tình yêu của hai bạn mãi mãi bền chặt như kim cương!	t	2025-10-23 18:58:10.31665
72269685-bda7-4c4a-a4f0-6a26fd9a3672	Trần Thị Mai	Gia đình nhỏ của hai bạn sẽ luôn tràn ngập tiếng cười hạnh phúc!	t	2025-10-23 18:58:10.31665
469719ab-f4c2-4d5f-944d-673d2d39cefa	Hoàng Minh Đức	Chúc hai bạn có một đám cưới thật tuyệt vời và đáng nhớ!	f	2025-10-23 18:58:10.31665
\.


--
-- Data for Name: photos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.photos (id, url, caption, category, "order", created_at, updated_at) FROM stdin;
ba89a29b-fa82-4403-aab7-f0442315ba55	/attached_assets/generated_images/Romantic_wedding_couple_hero_background_0afd25e7.png	Ảnh cưới lãng mạn	gallery	1	2025-10-23 18:58:05.325027	2025-10-23 18:58:05.325027
6bfaaa41-9ac9-4700-9b37-1382d70b4e5a	/attached_assets/generated_images/Pre-wedding_cherry_blossom_photo_87d19e2a.png	Ảnh cưới hoa anh đào	gallery	2	2025-10-23 18:58:05.325027	2025-10-23 18:58:05.325027
e603a6a8-7117-42c3-a1c5-ce715def6b22	/attached_assets/generated_images/Couple_engagement_park_photo_8a5ab5d9.png	Ảnh đính hôn tại công viên	gallery	3	2025-10-23 18:58:05.325027	2025-10-23 18:58:05.325027
0876bec3-f9bb-4118-838c-fde8f4afc3a1	/attached_assets/generated_images/Wedding_venue_ceremony_setup_4b2b0b2c.png	Sân khấu lễ cưới	gallery	4	2025-10-23 18:58:05.325027	2025-10-23 18:58:05.325027
bc4fbf65-9306-463e-a10f-97e1866801f8	/attached_assets/generated_images/Elegant_bride_portrait_photo_6abee8e2.png	Chân dung cô dâu	gallery	5	2025-10-23 18:58:05.325027	2025-10-23 18:58:05.325027
ee7c8b1e-7561-4ffe-9f25-1d5f254f5240	/attached_assets/generated_images/Handsome_groom_portrait_photo_1678e40a.png	Chân dung chú rể	gallery	6	2025-10-23 18:58:05.325027	2025-10-23 18:58:05.325027
\.


--
-- Data for Name: registry_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.registry_items (id, name, description, price, image_url, purchase_url, "order", created_at, updated_at) FROM stdin;
394b85d7-5725-46e7-b9d1-768c0b99dccc	Bộ đồ ăn cao cấp	Bộ đồ ăn sứ trắng 24 món, phong cách hiện đại	2500000	https://images.unsplash.com/photo-1578500494198-246f612d3b3d	https://example.com/products/dinnerware	1	2025-10-23 18:58:23.601558	2025-10-23 18:58:23.601558
8d9979c5-fa67-46f1-866d-d291671014b0	Máy pha cà phê	Máy pha cà phê espresso tự động	8000000	https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6	https://example.com/products/coffee-maker	2	2025-10-23 18:58:23.601558	2025-10-23 18:58:23.601558
4d022678-de2a-45eb-b2af-a6da53b1efdc	Chăn ga gối đệm cao cấp	Bộ chăn ga gối cotton 100% size King	3500000	https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af	https://example.com/products/bedding	3	2025-10-23 18:58:23.601558	2025-10-23 18:58:23.601558
d018a993-41a7-4fd4-8c65-05ee4c18abfe	Nồi cơm điện cao tần	Nồi cơm điện cao tần IH 1.8L	4500000	https://images.unsplash.com/photo-1585515320310-259814833e62	https://example.com/products/rice-cooker	4	2025-10-23 18:58:23.601558	2025-10-23 18:58:23.601558
047b8135-bf44-44cd-b372-519aff0f89fb	Robot hút bụi	Robot hút bụi thông minh, điều khiển qua app	12000000	https://images.unsplash.com/photo-1558317374-067fb5f30001	https://example.com/products/robot-vacuum	5	2025-10-23 18:58:23.601558	2025-10-23 18:58:23.601558
\.


--
-- Data for Name: rsvps; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rsvps (id, guest_name, email, phone, attending, guest_count, meal_preference, special_requirements, created_at) FROM stdin;
d54239bd-2557-4a8b-81f1-c60b29c91841	Phạm Văn Nam	phamnam@example.com	0912345678	t	2	Món chay	\N	2025-10-23 18:58:14.04286
00ad04cf-abc3-44fb-b9b7-50b2223a3b2b	Lê Thị Hương	lehuong@example.com	0987654321	t	1	Món mặn	Dị ứng hải sản	2025-10-23 18:58:14.04286
7c87eeeb-6c34-429a-a819-e4ac75197ef2	Nguyễn Quốc Anh	nguyenanh@example.com	0901234567	t	3	Món mặn	\N	2025-10-23 18:58:14.04286
e12948e6-2356-4541-8f24-5df4640558bc	Trần Thị Mai	tranmai@example.com	0923456789	f	0	\N	Không thể tham dự được, xin lỗi	2025-10-23 18:58:14.04286
\.


--
-- Data for Name: schedule_events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.schedule_events (id, title, description, event_time, location, icon, "order", created_at, updated_at) FROM stdin;
8d36777e-18fb-4386-b403-77ece6404165	Lễ Vu Quy	Lễ vu quy tại nhà gái	2025-12-25 09:00:00	Nhà gái - 123 Phố Huế, Hà Nội	Home	1	2025-10-23 18:58:00.668887	2025-10-23 18:58:00.668887
38f6f20c-19e0-4693-b657-fdea942b6252	Rước Dâu	Đoàn rước dâu từ nhà trai	2025-12-25 11:00:00	Nhà trai - 456 Kim Mã, Hà Nội	Car	2	2025-10-23 18:58:00.668887	2025-10-23 18:58:00.668887
bd238b38-6025-4357-a5c0-3b018b084c18	Lễ Thành Hôn	Lễ thành hôn chính thức	2025-12-25 14:00:00	Trung tâm Hội nghị Quốc gia, Hà Nội	Church	3	2025-10-23 18:58:00.668887	2025-10-23 18:58:00.668887
0625ba31-0f5c-4272-9622-3062ac56324b	Tiệc Chiêu Đãi	Tiệc chiêu đãi khách mời	2025-12-25 18:00:00	Trung tâm Hội nghị Quốc gia, Hà Nội	Wine	4	2025-10-23 18:58:00.668887	2025-10-23 18:58:00.668887
8defb2ff-1026-42bc-9335-1b95c70038c0	Tiệc Tối	Tiệc tối và chương trình văn nghệ	2025-12-25 19:30:00	Trung tâm Hội nghị Quốc gia, Hà Nội	Music	5	2025-10-23 18:58:00.668887	2025-10-23 18:58:00.668887
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (sid, sess, expire) FROM stdin;
303KH5g2F3fnjC1qJx_YMZtkTyBG4hMS	{"cookie": {"path": "/", "secure": true, "expires": "2025-10-30T19:02:15.241Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"claims": {"aud": "bab60102-b056-401c-98d6-d984ccb8f1e5", "exp": 1761249734, "iat": 1761246134, "iss": "https://replit.com/oidc", "sub": "48928662", "email": "muogua4tpl@obeamb.com", "at_hash": "O3l2ukDlGCZeGy0DI138GQ", "username": "muogua4tpl", "auth_time": 1761246133, "last_name": "Lợi", "first_name": "Hà"}, "expires_at": 1761249734, "access_token": "xWW8h7gO6LQD4Xd2Y1sJ_9cCbH7ITojBhM9uEDQZq03", "refresh_token": "lTiYmMYFUmvH-sReSTSQw44U8Xba4hO4FpQcIT8tP4V"}}}	2025-10-30 19:02:34
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings (id, venue_name, venue_address, venue_latitude, venue_longitude, background_music_url, updated_at) FROM stdin;
f0e25997-2acd-42e4-be49-130f3ccc13ce	Trung tâm Hội nghị Quốc gia	Số 31 Bà Triệu, Hoàn Kiếm, Hà Nội	21.0191	105.8490	https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3	2025-10-23 18:58:26.130605
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, first_name, last_name, profile_image_url, created_at, updated_at) FROM stdin;
48928662	muogua4tpl@obeamb.com	Hà	Lợi	\N	2025-10-23 19:02:14.896879	2025-10-23 19:02:14.896879
\.


--
-- Name: couple_info couple_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.couple_info
    ADD CONSTRAINT couple_info_pkey PRIMARY KEY (id);


--
-- Name: guest_messages guest_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guest_messages
    ADD CONSTRAINT guest_messages_pkey PRIMARY KEY (id);


--
-- Name: photos photos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_pkey PRIMARY KEY (id);


--
-- Name: registry_items registry_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registry_items
    ADD CONSTRAINT registry_items_pkey PRIMARY KEY (id);


--
-- Name: rsvps rsvps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rsvps
    ADD CONSTRAINT rsvps_pkey PRIMARY KEY (id);


--
-- Name: schedule_events schedule_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule_events
    ADD CONSTRAINT schedule_events_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- PostgreSQL database dump complete
--

