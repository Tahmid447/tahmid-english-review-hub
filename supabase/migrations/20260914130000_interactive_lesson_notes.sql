-- Private, structured lesson notebooks. No existing student data is rewritten.
-- All mutations go through bounded, actor-checked RPCs. Browser flags are never authority.
create table public.review_lesson_notes (
 id uuid primary key default gen_random_uuid(),
 student_id uuid not null references public.review_profiles(user_id),
 teacher_id uuid not null references auth.users(id),
 lesson_date date not null default current_date,
 title text not null check(length(btrim(title)) between 1 and 180),
 summary text not null default '' check(length(summary)<=1200),
 focus text not null default '' check(length(focus)<=2000),
 tags text[] not null default '{}' check(cardinality(tags)<=12),
 content_json jsonb not null default '{"schemaVersion":1,"blocks":[]}',
 status text not null default 'draft' check(status in ('draft','published','archived')),
 allow_student_annotations boolean not null default true,
 allow_student_suggestions boolean not null default false,
 allow_student_images boolean not null default false,
 allow_student_comments boolean not null default false,
 allow_direct_student_edit boolean not null default false,
 notify_teacher_on_change boolean not null default true,
 cover_asset_id uuid,
 version integer not null default 1,
 published_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 updated_by uuid not null default auth.uid() references auth.users(id)
);
create index review_notes_student_date on public.review_lesson_notes(student_id,lesson_date desc,created_at desc);
create index review_notes_teacher on public.review_lesson_notes(teacher_id,updated_at desc);

create table public.review_lesson_note_annotations (
 id uuid primary key default gen_random_uuid(), note_id uuid not null references public.review_lesson_notes(id),
 student_id uuid not null references auth.users(id), block_id text not null default '',
 body text not null check(length(body)<=6000), version integer not null default 1,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(note_id,student_id,block_id)
);
create table public.review_lesson_note_suggestions (
 id uuid primary key default gen_random_uuid(), note_id uuid not null references public.review_lesson_notes(id),
 student_id uuid not null references auth.users(id), block_id text not null,
 original_content jsonb not null, proposed_content jsonb not null,
 status text not null default 'pending' check(status in ('pending','accepted','rejected','resolved')),
 reviewed_by uuid references auth.users(id), reviewed_at timestamptz, created_at timestamptz not null default now()
);
create index review_note_suggestions_note on public.review_lesson_note_suggestions(note_id,created_at desc);
create table public.review_lesson_note_comments (
 id uuid primary key default gen_random_uuid(), note_id uuid not null references public.review_lesson_notes(id),
 actor_id uuid not null references auth.users(id), body text not null check(length(btrim(body)) between 1 and 4000),
 created_at timestamptz not null default now()
);
create table public.review_lesson_note_assets (
 id uuid primary key default gen_random_uuid(), note_id uuid not null references public.review_lesson_notes(id),
 uploader_id uuid not null references auth.users(id), uploader_role text not null check(uploader_role in ('teacher','student')),
 asset_type text not null check(asset_type in ('infographic','worksheet','reference','teacher_attachment','student_attachment')),
 storage_path text not null unique, thumbnail_path text not null unique,
 mime_type text not null check(mime_type in ('image/jpeg','image/png','image/webp')),
 title text not null default '' check(length(title)<=180), caption text not null default '' check(length(caption)<=2000),
 alt_text text not null check(length(btrim(alt_text)) between 1 and 500), display_order integer not null default 0,
 state text not null default 'pending' check(state in ('pending','ready','archived')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check ((uploader_role='student')=(asset_type='student_attachment'))
);
create index review_note_assets_note on public.review_lesson_note_assets(note_id,state,display_order);
alter table public.review_lesson_notes add constraint review_note_cover_fk foreign key(cover_asset_id) references public.review_lesson_note_assets(id);

create table public.review_lesson_note_revisions (
 id uuid primary key default gen_random_uuid(), note_id uuid not null references public.review_lesson_notes(id),
 snapshot_json jsonb not null, changed_by uuid not null references auth.users(id), change_type text not null,
 affected_blocks text[] not null default '{}', created_at timestamptz not null default now()
);
create index review_note_revision_recent on public.review_lesson_note_revisions(note_id,created_at desc);
create table public.review_lesson_note_review_status (
 note_id uuid not null references public.review_lesson_notes(id), student_id uuid not null references auth.users(id),
 viewed_version integer not null default 0, reviewed_version integer not null default 0,
 viewed_at timestamptz, reviewed_at timestamptz, primary key(note_id,student_id)
);
create table public.review_lesson_note_activity (
 id uuid primary key default gen_random_uuid(), note_id uuid not null references public.review_lesson_notes(id),
 actor_id uuid not null references auth.users(id), actor_role text not null,
 action_type text not null, entity_key text not null default '',
 batch_at timestamptz not null default date_bin('30 minutes',now(),'2026-01-01'::timestamptz),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(note_id,actor_id,action_type,entity_key,batch_at)
);
create index review_note_activity_recent on public.review_lesson_note_activity(note_id,updated_at desc);
-- One inbox entry per note/student. Different actions accumulate until acknowledged.
create table public.review_lesson_note_notifications (
 note_id uuid not null references public.review_lesson_notes(id), teacher_id uuid not null references auth.users(id),
 actor_id uuid not null references auth.users(id), counts jsonb not null default '{}',
 unread boolean not null default true, updated_at timestamptz not null default now(),
 primary key(note_id,actor_id)
);
create index review_note_notices_teacher on public.review_lesson_note_notifications(teacher_id,unread,updated_at desc);

-- Extend the existing personal-card collection; no parallel phrasebook.
alter table public.review_personal_cards
 add column source_note_id uuid references public.review_lesson_notes(id),
 add column source_block_id text,
 add column source_lesson_date date,
 add column source_tags text[] not null default '{}';
create unique index review_personal_note_phrase on public.review_personal_cards(student_id,source_note_id,source_block_id)
 where source_note_id is not null;

create function public.review_note_teacher(n public.review_lesson_notes) returns boolean
 language sql stable security definer set search_path='' as $$
 select coalesce(n.teacher_id=auth.uid() and public.review_teacher_can_manage(n.student_id),false);
$$;
create function public.review_note_student(n public.review_lesson_notes) returns boolean
 language sql stable security definer set search_path='' as $$
 select coalesce(auth.uid()=n.student_id and n.status='published' and not public.is_review_teacher()
   and public.review_student_hub_feature_enabled('homework'),false);
$$;
create function public.review_note_access(target_note uuid, teacher_only boolean default false) returns boolean
 language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.review_lesson_notes n where n.id=target_note
   and (public.review_note_teacher(n) or (not teacher_only and public.review_note_student(n))));
$$;

-- Compact, portable semantic JSON: never rendered as HTML. Stable IDs also anchor notes/saves.
create function public.review_note_validate_content(content jsonb) returns void
 language plpgsql immutable set search_path='' as $$
declare b jsonb; ids text[]='{}'; k text;
begin
 if content is null or jsonb_typeof(content)<>'object' or content->>'schemaVersion' is distinct from '1'
   or jsonb_typeof(content->'blocks') is distinct from 'array' or octet_length(content::text)>220000
   or jsonb_array_length(content->'blocks')>150 then raise exception 'Invalid lesson structure (maximum 150 blocks / 220KB)'; end if;
 for b in select value from jsonb_array_elements(content->'blocks') loop
  if jsonb_typeof(b)<>'object' or coalesce(b->>'id','') !~ '^[a-zA-Z0-9_-]{1,80}$'
    or b->>'id'=any(ids) or coalesce(b->>'type','') not in
    ('heading','paragraph','bullet_list','japanese_to_english','natural_english_upgrade','common_mistake','grammar_point','nuance','pronunciation','useful_phrase','vocabulary','teacher_tip','example','comparison','quick_practice','callout','collapsible_section','image','divider')
    then raise exception 'Invalid or duplicate lesson block'; end if;
  ids=array_append(ids,b->>'id');
  if coalesce(b->>'japaneseSupportMode','none') not in ('none','short','explanation') or (b ? 'japaneseSupportMode' and jsonb_typeof(b->'japaneseSupportMode')<>'string') then raise exception 'Invalid Japanese support mode'; end if;
  foreach k in array array['englishText','japaneseSupport','explanation','originalText','title','answer','ipa','comparisonText','comparisonJapanese'] loop
   if b ? k and (jsonb_typeof(b->k)<>'string' or length(b->>k)>6000) then raise exception 'Invalid block text'; end if;
  end loop;
  foreach k in array array['examples','items','correctOptions','tags'] loop
   if b ? k and (jsonb_typeof(b->k)<>'array' or jsonb_array_length(b->k)>30) then raise exception 'Invalid block list'; end if;
   if exists(select 1 from jsonb_array_elements(coalesce(b->k,'[]')) x where jsonb_typeof(x)<>'string' or length(x#>>'{}')>2000) then raise exception 'Invalid list text'; end if;
  end loop;
  if b ? 'displayOptions' and jsonb_typeof(b->'displayOptions')<>'object' then raise exception 'Invalid display options'; end if;
 end loop;
end;
$$;
create function public.review_note_block(n public.review_lesson_notes, target_block text) returns jsonb
 language sql immutable set search_path='' as $$
 select value from jsonb_array_elements(n.content_json->'blocks') where value->>'id'=target_block;
$$;
create function public.review_note_snapshot(n public.review_lesson_notes, reason text, blocks text[] default '{}') returns void
 language sql security definer set search_path='' as $$
 insert into public.review_lesson_note_revisions(note_id,snapshot_json,changed_by,change_type,affected_blocks)
 values(n.id,jsonb_build_object('note',to_jsonb(n),'assets',coalesce((select jsonb_agg(to_jsonb(a)) from public.review_lesson_note_assets a where a.note_id=n.id and a.uploader_role='teacher' and a.state<>'pending'),'[]')),auth.uid(),reason,blocks);
$$;
create function public.review_note_event(n public.review_lesson_notes, action text, entity text default '') returns void
 language plpgsql security definer set search_path='' as $$
declare fresh uuid; student_actor boolean=n.student_id=auth.uid();
begin
 insert into public.review_lesson_note_activity(note_id,actor_id,actor_role,action_type,entity_key)
 values(n.id,auth.uid(),case when student_actor then 'student' else 'teacher' end,action,entity)
 on conflict do nothing returning id into fresh;
 if fresh is null then
  update public.review_lesson_note_activity set updated_at=now() where note_id=n.id and actor_id=auth.uid() and action_type=action and entity_key=entity and batch_at=date_bin('30 minutes',now(),'2026-01-01'::timestamptz);
 end if;
 if fresh is not null and student_actor and n.notify_teacher_on_change then
  insert into public.review_lesson_note_notifications(note_id,teacher_id,actor_id,counts)
  values(n.id,n.teacher_id,auth.uid(),jsonb_build_object(action,1))
  on conflict(note_id,actor_id) do update set unread=true,updated_at=now(),counts=
   case when not review_lesson_note_notifications.unread then jsonb_build_object(action,1)
   else jsonb_set(review_lesson_note_notifications.counts,array[action],to_jsonb(coalesce((review_lesson_note_notifications.counts->>action)::integer,0)+1)) end;
 end if;
end;
$$;

-- Teacher save also handles publish/unpublish/archive. Version conflicts never overwrite edits.
create function public.review_note_save(target_note uuid, target_student uuid, expected_version integer, payload jsonb)
 returns public.review_lesson_notes language plpgsql security definer set search_path='' as $$
declare n public.review_lesson_notes; fresh boolean=target_note is null; s text;
begin
 if fresh then
  if not public.review_teacher_can_manage(target_student) then raise exception 'Teacher authorisation required'; end if;
 else
  select * into n from public.review_lesson_notes where id=target_note for update;
  if n.id is null or not public.review_note_teacher(n) then raise exception 'Note unavailable'; end if;
  if n.version is distinct from expected_version then raise exception 'NOTE_CONFLICT: reload the latest version before saving'; end if;
 end if;
 perform public.review_note_validate_content(payload->'content_json');
 s=coalesce(payload->>'status','draft');
 if s not in ('draft','published','archived') then raise exception 'Invalid status'; end if;
 if s='published' and (length(btrim(coalesce(payload->>'focus','')))=0 or jsonb_array_length(payload->'content_json'->'blocks')=0) then raise exception 'Add Today’s Focus and teaching blocks before publishing'; end if;
 if jsonb_typeof(coalesce(payload->'tags','[]'))<>'array' or jsonb_array_length(coalesce(payload->'tags','[]'))>12
 or exists(select 1 from jsonb_array_elements(coalesce(payload->'tags','[]')) t where jsonb_typeof(t)<>'string' or length(t#>>'{}')>50) then raise exception 'Invalid tags'; end if;
 if fresh then
  insert into public.review_lesson_notes(student_id,teacher_id,title,updated_by) values(target_student,auth.uid(),payload->>'title',auth.uid()) returning * into n;
 else perform public.review_note_snapshot(n,'teacher_update'); end if;
 update public.review_lesson_notes set
 title=payload->>'title',lesson_date=(payload->>'lesson_date')::date,summary=coalesce(payload->>'summary',''),focus=coalesce(payload->>'focus',''),
 tags=array(select jsonb_array_elements_text(coalesce(payload->'tags','[]'))),content_json=payload->'content_json',status=s,
 allow_student_annotations=coalesce((payload->>'allow_student_annotations')::boolean,true),
 allow_student_suggestions=coalesce((payload->>'allow_student_suggestions')::boolean,false),
 allow_student_images=coalesce((payload->>'allow_student_images')::boolean,false),
 allow_student_comments=coalesce((payload->>'allow_student_comments')::boolean,false),
 allow_direct_student_edit=coalesce((payload->>'allow_direct_student_edit')::boolean,false),
 notify_teacher_on_change=coalesce((payload->>'notify_teacher_on_change')::boolean,true),
 published_at=case when s='published' then coalesce(n.published_at,now()) else n.published_at end,
 version=case when fresh then 1 else n.version+1 end,updated_at=now(),updated_by=auth.uid()
 where id=n.id returning * into n;
 perform public.review_note_event(n,case when fresh then 'note_created' when s='published' then 'note_published_or_updated' when s='archived' then 'note_archived' else 'draft_saved' end,n.version::text);
 return n;
end;
$$;

create function public.review_note_annotate(target_note uuid,target_block text,body_text text,expected_version integer default 0)
 returns public.review_lesson_note_annotations language plpgsql security definer set search_path='' as $$
declare n public.review_lesson_notes; a public.review_lesson_note_annotations;
begin
 select * into n from public.review_lesson_notes where id=target_note for update;
 if n.id is null or not public.review_note_student(n) or not n.allow_student_annotations then raise exception 'Annotations are not allowed'; end if;
 if target_block is null or (target_block<>'' and public.review_note_block(n,target_block) is null) then raise exception 'Block unavailable'; end if;
 select * into a from public.review_lesson_note_annotations where note_id=n.id and student_id=auth.uid() and block_id=target_block;
 if coalesce(a.version,0) is distinct from expected_version then raise exception 'NOTE_CONFLICT: this annotation changed in another tab'; end if;
 if a.id is null then
  insert into public.review_lesson_note_annotations(note_id,student_id,block_id,body) values(n.id,auth.uid(),target_block,body_text) returning * into a;
 else update public.review_lesson_note_annotations set body=body_text,version=version+1,updated_at=now() where id=a.id returning * into a; end if;
 perform public.review_note_event(n,'annotation',a.id::text);
 return a;
end;
$$;

-- Students propose/edit text fields only; cannot grant themselves edit/audio/display permissions.
create function public.review_note_text_change(original jsonb, changes jsonb) returns jsonb
 language plpgsql immutable set search_path='' as $$
declare changed jsonb; key text;
begin
 if jsonb_typeof(changes)<>'object' then raise exception 'Invalid text change'; end if;
 for key in select jsonb_object_keys(changes) loop
  if key not in ('englishText','japaneseSupport','japaneseSupportMode','explanation','originalText','title','answer','ipa','comparisonText','comparisonJapanese','examples','items','correctOptions') then raise exception 'Only permitted text fields may change'; end if;
 end loop;
 changed=original||changes;
 perform public.review_note_validate_content(jsonb_build_object('schemaVersion',1,'blocks',jsonb_build_array(changed)));
 return changed;
end;
$$;
create function public.review_note_suggest(target_note uuid,target_block text,changes jsonb)
 returns uuid language plpgsql security definer set search_path='' as $$
declare n public.review_lesson_notes; b jsonb; sid uuid;
begin
 select * into n from public.review_lesson_notes where id=target_note for update;
 if n.id is null or not public.review_note_student(n) or not n.allow_student_suggestions then raise exception 'Suggestions are not allowed'; end if;
 b=public.review_note_block(n,target_block); if b is null then raise exception 'Block unavailable'; end if;
 if (select count(*) from public.review_lesson_note_suggestions where note_id=n.id and status='pending')>=50 then raise exception 'Please wait for pending suggestions to be reviewed'; end if;
 insert into public.review_lesson_note_suggestions(note_id,student_id,block_id,original_content,proposed_content)
 values(n.id,auth.uid(),target_block,b,public.review_note_text_change(b,changes)) returning id into sid;
 perform public.review_note_event(n,'suggestion',sid::text); return sid;
end;
$$;
create function public.review_note_review_suggestion(target_suggestion uuid,decision text,expected_version integer)
 returns public.review_lesson_notes language plpgsql security definer set search_path='' as $$
declare n public.review_lesson_notes; s public.review_lesson_note_suggestions;
begin
 select * into s from public.review_lesson_note_suggestions where id=target_suggestion;
 select * into n from public.review_lesson_notes where id=s.note_id for update;
 if n.id is null or not public.review_note_teacher(n) then raise exception 'Note unavailable'; end if;
 -- Note lock serializes all reviews of suggestions for this lesson.
 select * into s from public.review_lesson_note_suggestions where id=target_suggestion;
 if s.status<>'pending' or decision not in ('accepted','rejected','resolved') then raise exception 'Suggestion already reviewed or invalid decision'; end if;
 if decision='accepted' then
  if n.version is distinct from expected_version or public.review_note_block(n,s.block_id) is distinct from s.original_content then raise exception 'NOTE_CONFLICT: the original block has changed; review or resolve this suggestion'; end if;
  perform public.review_note_snapshot(n,'suggestion_accepted',array[s.block_id]);
  update public.review_lesson_notes set content_json=jsonb_set(content_json,'{blocks}',
   (select jsonb_agg(case when value->>'id'=s.block_id then s.proposed_content else value end order by ordinality) from jsonb_array_elements(content_json->'blocks') with ordinality)),
   version=version+1,updated_at=now(),updated_by=auth.uid() where id=n.id returning * into n;
 end if;
 update public.review_lesson_note_suggestions set status=decision,reviewed_by=auth.uid(),reviewed_at=now() where id=s.id;
 perform public.review_note_event(n,'suggestion_'||decision,s.id::text);return n;
end;
$$;
create function public.review_note_direct_edit(target_note uuid,expected_version integer,block_changes jsonb)
 returns public.review_lesson_notes language plpgsql security definer set search_path='' as $$
declare n public.review_lesson_notes; b jsonb; c jsonb; updated_blocks jsonb='[]'; affected text[]='{}';
begin
 select * into n from public.review_lesson_notes where id=target_note for update;
 if n.id is null or not public.review_note_student(n) or not n.allow_direct_student_edit then raise exception 'Direct editing is not allowed'; end if;
 if n.version is distinct from expected_version then raise exception 'NOTE_CONFLICT: reload the latest lesson'; end if;
 if jsonb_typeof(block_changes)<>'object' or block_changes='{}' then raise exception 'Choose a permitted block'; end if;
 for b in select value from jsonb_array_elements(n.content_json->'blocks') loop
  c=block_changes->(b->>'id');
  if c is not null then
   if b->'displayOptions'->>'studentEditable' is distinct from 'true' then raise exception 'This block is not editable'; end if;
   affected=array_append(affected,b->>'id'); b=public.review_note_text_change(b,c);
  end if;
  updated_blocks=updated_blocks||jsonb_build_array(b);
 end loop;
 if cardinality(affected)<>(select count(*) from jsonb_object_keys(block_changes)) then raise exception 'Block unavailable'; end if;
 perform public.review_note_snapshot(n,'student_direct_edit',affected);
 update public.review_lesson_notes set content_json=jsonb_set(content_json,'{blocks}',updated_blocks),version=version+1,updated_by=auth.uid(),updated_at=now() where id=n.id returning * into n;
 perform public.review_note_event(n,'direct_edit',n.version::text);return n;
end;
$$;

create function public.review_note_comment(target_note uuid,body_text text) returns uuid
 language plpgsql security definer set search_path='' as $$
declare n public.review_lesson_notes; cid uuid;
begin
 select * into n from public.review_lesson_notes where id=target_note for update;
 if n.id is null or not (public.review_note_teacher(n) or (public.review_note_student(n) and n.allow_student_comments)) then raise exception 'Comments are not allowed'; end if;
 if (select count(*) from public.review_lesson_note_comments where note_id=n.id and created_at>now()-interval '1 hour')>=60 then raise exception 'Please try again later'; end if;
 insert into public.review_lesson_note_comments(note_id,actor_id,body) values(n.id,auth.uid(),body_text) returning id into cid;
 perform public.review_note_event(n,'comment',cid::text);return cid;
end;
$$;
create function public.review_note_mark(target_note uuid,reviewed boolean,expected_version integer) returns void
 language plpgsql security definer set search_path='' as $$
declare n public.review_lesson_notes;
begin
 select * into n from public.review_lesson_notes where id=target_note for share;
 if n.id is null or not public.review_note_student(n) then raise exception 'Note unavailable'; end if;
 if n.version is distinct from expected_version then raise exception 'NOTE_CONFLICT: refresh to review the latest lesson'; end if;
 insert into public.review_lesson_note_review_status(note_id,student_id,viewed_version,viewed_at,reviewed_version,reviewed_at)
 values(n.id,auth.uid(),n.version,now(),case when reviewed then n.version else 0 end,case when reviewed then now() end)
 on conflict(note_id,student_id) do update set viewed_version=n.version,viewed_at=now(),
 reviewed_version=case when reviewed then n.version else review_lesson_note_review_status.reviewed_version end,
 reviewed_at=case when reviewed then now() else review_lesson_note_review_status.reviewed_at end;
end;
$$;
create function public.review_note_acknowledge(target_note uuid) returns void
 language plpgsql security definer set search_path='' as $$
begin
 if not public.review_note_access(target_note,true) then raise exception 'Note unavailable'; end if;
 update public.review_lesson_note_notifications set unread=false where note_id=target_note and teacher_id=auth.uid();
end;
$$;

create function public.review_note_save_phrase(target_note uuid,target_block text) returns uuid
 language plpgsql security definer set search_path='' as $$
declare n public.review_lesson_notes; b jsonb; cid uuid; phrase text;
begin
 select * into n from public.review_lesson_notes where id=target_note for share;
 if n.id is null or not public.review_note_student(n) then raise exception 'Note unavailable'; end if;
 b=public.review_note_block(n,target_block); phrase=b->>'englishText';
 if b is null or b->>'type' not in ('useful_phrase','vocabulary','japanese_to_english','natural_english_upgrade','example','pronunciation','comparison')
   or length(btrim(coalesce(phrase,'')))=0 or length(phrase)>2000 then raise exception 'This block is not a savable phrase'; end if;
 insert into public.review_personal_cards(teacher_id,student_id,category,text_en,text_ja,teacher_note,audio_enabled,source_note_id,source_block_id,source_lesson_date,source_tags)
 values(n.teacher_id,n.student_id,case when b->>'type'='vocabulary' then 'words' else 'phrases' end,phrase,
 left(case when b->>'japaneseSupportMode'='none' then '' else coalesce(b->>'japaneseSupport','') end,2000),
 left(n.title,2000),coalesce(b->'pronunciation'->>'enabled','false')='true',n.id,target_block,n.lesson_date,
 array(select distinct unnest(n.tags||array(select jsonb_array_elements_text(coalesce(b->'tags','[]'))))))
 on conflict(student_id,source_note_id,source_block_id) where source_note_id is not null do update set active=true
 returning id into cid;
 insert into public.review_personal_card_favorites(student_id,card_id) values(auth.uid(),cid) on conflict do nothing;
 return cid;
end;
$$;

-- Reserve immutable random paths before upload. Storage checks this server-authored manifest.
create function public.review_note_asset_reserve(target_note uuid,asset_metadata jsonb) returns public.review_lesson_note_assets
 language plpgsql security definer set search_path='' as $$
declare n public.review_lesson_notes; a public.review_lesson_note_assets; aid uuid=gen_random_uuid();
 teacher_actor boolean; mime text=asset_metadata->>'mime_type'; ext text; prefix text;
begin
 select * into n from public.review_lesson_notes where id=target_note for update;
 teacher_actor=public.review_note_teacher(n);
 if n.id is null or not (teacher_actor or (public.review_note_student(n) and n.allow_student_images)) then raise exception 'Image uploads are not allowed'; end if;
 ext=case mime when 'image/jpeg' then 'jpg' when 'image/png' then 'png' when 'image/webp' then 'webp' end;
 if ext is null then raise exception 'Use PNG, JPEG or WebP'; end if;
 if (select count(*) from public.review_lesson_note_assets where note_id=n.id)>=100 then raise exception 'Image history limit reached (100 versions). Please create another lesson note'; end if;
 if (select count(*) from public.review_lesson_note_assets where note_id=n.id and state='pending' and uploader_id=auth.uid())>=6 then raise exception 'Finish or remove pending uploads first'; end if;
 if (select count(*) from public.review_lesson_note_assets where note_id=n.id and state='ready' and uploader_role=case when teacher_actor then 'teacher' else 'student' end)>=30 then raise exception 'Maximum 30 visible images per contributor role'; end if;
 prefix=n.student_id::text||'/'||n.id::text||'/'||auth.uid()::text||'/'||aid::text;
 insert into public.review_lesson_note_assets(id,note_id,uploader_id,uploader_role,asset_type,storage_path,thumbnail_path,mime_type,title,caption,alt_text,display_order)
 values(aid,n.id,auth.uid(),case when teacher_actor then 'teacher' else 'student' end,
 case when teacher_actor then coalesce(asset_metadata->>'asset_type','infographic') else 'student_attachment' end,
 prefix||'.'||ext,prefix||'-thumb.jpg',mime,coalesce(asset_metadata->>'title',''),coalesce(asset_metadata->>'caption',''),asset_metadata->>'alt_text',
 coalesce((select max(display_order)+1 from public.review_lesson_note_assets where note_id=n.id and state='ready'),0)) returning * into a;
 return a;
end;
$$;
create function public.review_note_asset_finish(target_asset uuid,replace_asset uuid default null) returns public.review_lesson_note_assets
 language plpgsql security definer set search_path='' as $$
declare n public.review_lesson_notes; a public.review_lesson_note_assets; old public.review_lesson_note_assets;
begin
 select * into a from public.review_lesson_note_assets where id=target_asset;
 select * into n from public.review_lesson_notes where id=a.note_id for update;
 select * into a from public.review_lesson_note_assets where id=target_asset for update;
 if a.id is null or a.state<>'pending' or a.uploader_id<>auth.uid()
 or not (public.review_note_teacher(n) or (public.review_note_student(n) and n.allow_student_images)) then raise exception 'Upload unavailable'; end if;
 if not exists(select 1 from storage.objects where bucket_id='review-lesson-note-assets' and name=a.storage_path
   and metadata->>'mimetype'=a.mime_type and (metadata->>'size')::bigint between 1 and 5242880)
 or not exists(select 1 from storage.objects where bucket_id='review-lesson-note-assets' and name=a.thumbnail_path
   and metadata->>'mimetype'='image/jpeg' and (metadata->>'size')::bigint between 1 and 262144)
 then raise exception 'Both validated image files must finish uploading'; end if;
 if replace_asset is not null then
  select * into old from public.review_lesson_note_assets where id=replace_asset;
  if old.id is null or not public.review_note_teacher(n) or old.note_id<>n.id or old.uploader_role<>'teacher' or old.state<>'ready' then raise exception 'Replacement unavailable'; end if;
 end if;
 if a.uploader_role='teacher' then perform public.review_note_snapshot(n,case when replace_asset is null then 'asset_added' else 'asset_replaced' end); end if;
 update public.review_lesson_note_assets set state='ready',updated_at=now(),display_order=coalesce(old.display_order,display_order) where id=a.id returning * into a;
 if old.id is not null then update public.review_lesson_note_assets set state='archived',updated_at=now() where id=old.id; end if;
 if a.uploader_role='teacher' then
  update public.review_lesson_notes set version=version+1,updated_by=auth.uid(),updated_at=now(),cover_asset_id=case when cover_asset_id=old.id then a.id else cover_asset_id end where id=n.id;
 end if;
 perform public.review_note_event(n,case when a.uploader_role='student' then 'student_image' when old.id is not null then 'asset_replaced' else 'asset_added' end,a.id::text);
 return a;
end;
$$;
create function public.review_note_asset_change(target_asset uuid,changes jsonb,expected_version integer default null) returns void
 language plpgsql security definer set search_path='' as $$
declare n public.review_lesson_notes; a public.review_lesson_note_assets; teacher_actor boolean;
begin
 select * into a from public.review_lesson_note_assets where id=target_asset;
 select * into n from public.review_lesson_notes where id=a.note_id for update;
 teacher_actor=public.review_note_teacher(n);
 if a.id is null or not (teacher_actor or (a.uploader_id=auth.uid() and public.review_note_student(n) and n.allow_student_images)) then raise exception 'Attachment unavailable'; end if;
 if teacher_actor and n.version is distinct from expected_version then raise exception 'NOTE_CONFLICT: refresh before changing images'; end if;
 if not teacher_actor and exists(select 1 from jsonb_object_keys(changes) k where k not in ('caption','archive')) then raise exception 'Only your caption or removal may change'; end if;
 if a.state='pending' then raise exception 'Finish or cancel this upload first'; end if;
 if teacher_actor then perform public.review_note_snapshot(n,'asset_updated'); end if;
 update public.review_lesson_note_assets set title=coalesce(changes->>'title',title),caption=coalesce(changes->>'caption',caption),
 alt_text=coalesce(changes->>'alt_text',alt_text),asset_type=coalesce(changes->>'asset_type',asset_type),
 state=case when changes->>'archive'='true' then 'archived' else state end,updated_at=now() where id=a.id;
 if teacher_actor then update public.review_lesson_notes set version=version+1,updated_by=auth.uid(),updated_at=now(),cover_asset_id=case when cover_asset_id=a.id and changes->>'archive'='true' then null else cover_asset_id end where id=n.id; end if;
 perform public.review_note_event(n,'asset_updated',a.id::text);
end;
$$;
create function public.review_note_assets_order(target_note uuid,asset_ids uuid[],cover_id uuid,expected_version integer) returns void
 language plpgsql security definer set search_path='' as $$
declare n public.review_lesson_notes;
begin
 select * into n from public.review_lesson_notes where id=target_note for update;
 if n.id is null or not public.review_note_teacher(n) then raise exception 'Note unavailable'; end if;
 if n.version is distinct from expected_version then raise exception 'NOTE_CONFLICT: refresh before reordering'; end if;
 if cardinality(asset_ids)<>(select count(*) from public.review_lesson_note_assets where note_id=n.id and state='ready' and uploader_role='teacher')
 or cardinality(asset_ids)<>(select count(distinct id) from unnest(asset_ids) id)
 or exists(select 1 from unnest(asset_ids) x where not exists(select 1 from public.review_lesson_note_assets a where a.id=x and a.note_id=n.id and a.state='ready' and a.uploader_role='teacher'))
 or (cover_id is not null and not cover_id=any(asset_ids)) then raise exception 'Invalid gallery order or cover'; end if;
 perform public.review_note_snapshot(n,'assets_reordered');
 update public.review_lesson_note_assets a set display_order=s.position,updated_at=now() from (select id,ordinality::integer as position from unnest(asset_ids) with ordinality ids(id,ordinality)) s where a.id=s.id;
 update public.review_lesson_notes set cover_asset_id=cover_id,version=version+1,updated_by=auth.uid(),updated_at=now() where id=n.id;
 perform public.review_note_event(n,'assets_reordered',(n.version+1)::text);
end;
$$;
create function public.review_note_asset_cancel(target_asset uuid) returns void
 language plpgsql security definer set search_path='' as $$
declare a public.review_lesson_note_assets;
begin
 select * into a from public.review_lesson_note_assets where id=target_asset for update;
 if a.id is null or a.state<>'pending' or a.uploader_id<>auth.uid() or not public.review_note_access(a.note_id) then raise exception 'Upload unavailable'; end if;
 if exists(select 1 from storage.objects where bucket_id='review-lesson-note-assets' and name in (a.storage_path,a.thumbnail_path)) then raise exception 'Remove unfinished files first'; end if;
 delete from public.review_lesson_note_assets where id=a.id;
end;
$$;
create function public.review_note_restore(target_revision uuid,expected_version integer) returns public.review_lesson_notes
 language plpgsql security definer set search_path='' as $$
declare n public.review_lesson_notes; r public.review_lesson_note_revisions; saved public.review_lesson_notes; a jsonb;
begin
 select * into r from public.review_lesson_note_revisions where id=target_revision;
 select * into n from public.review_lesson_notes where id=r.note_id for update;
 if n.id is null or not public.review_note_teacher(n) then raise exception 'Revision unavailable'; end if;
 if n.version is distinct from expected_version then raise exception 'NOTE_CONFLICT: refresh history before restoring'; end if;
 saved=jsonb_populate_record(null::public.review_lesson_notes,r.snapshot_json->'note');
 perform public.review_note_validate_content(saved.content_json);
 perform public.review_note_snapshot(n,'revision_restored');
 -- Restore as a private draft, requiring deliberate publication after review.
 update public.review_lesson_notes set title=saved.title,summary=saved.summary,focus=saved.focus,lesson_date=saved.lesson_date,tags=saved.tags,
 content_json=saved.content_json,status='draft',allow_student_annotations=saved.allow_student_annotations,
 allow_student_suggestions=saved.allow_student_suggestions,allow_student_images=saved.allow_student_images,
 allow_student_comments=saved.allow_student_comments,allow_direct_student_edit=saved.allow_direct_student_edit,
 notify_teacher_on_change=saved.notify_teacher_on_change,cover_asset_id=saved.cover_asset_id,
 version=n.version+1,updated_by=auth.uid(),updated_at=now() where id=n.id returning * into n;
 update public.review_lesson_note_assets set state='archived' where note_id=n.id and uploader_role='teacher' and state='ready';
 for a in select value from jsonb_array_elements(r.snapshot_json->'assets') loop
  update public.review_lesson_note_assets set state=a->>'state',title=a->>'title',caption=a->>'caption',alt_text=a->>'alt_text',asset_type=a->>'asset_type',display_order=(a->>'display_order')::integer,updated_at=now()
   where id=(a->>'id')::uuid and note_id=n.id and uploader_role='teacher';
 end loop;
 perform public.review_note_event(n,'revision_restored',r.id::text);return n;
end;
$$;

-- Private storage manifest policy; retained archived versions are teacher-only.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('review-lesson-note-assets','review-lesson-note-assets',false,5242880,array['image/png','image/jpeg','image/webp']);
create function public.review_note_storage_access(object_name text,operation text) returns boolean
 language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.review_lesson_note_assets a join public.review_lesson_notes n on n.id=a.note_id
 where object_name in (a.storage_path,a.thumbnail_path) and case operation
 when 'insert' then a.state='pending' and a.uploader_id=auth.uid() and
   (public.review_note_teacher(n) or (public.review_note_student(n) and n.allow_student_images))
 when 'read' then public.review_note_teacher(n) or (public.review_note_student(n) and (a.state='ready' or (a.state='pending' and a.uploader_id=auth.uid())))
 when 'delete' then a.state='pending' and a.uploader_id=auth.uid() and (public.review_note_teacher(n) or public.review_note_student(n))
 else false end);
$$;
create policy review_note_files_read on storage.objects for select to authenticated using(bucket_id='review-lesson-note-assets' and public.review_note_storage_access(name,'read'));
create policy review_note_files_insert on storage.objects for insert to authenticated with check(bucket_id='review-lesson-note-assets' and public.review_note_storage_access(name,'insert'));
create policy review_note_files_cancel on storage.objects for delete to authenticated using(bucket_id='review-lesson-note-assets' and public.review_note_storage_access(name,'delete'));
-- No UPDATE policy: images referenced by revisions cannot be silently overwritten.

do $$ declare t text; begin
 foreach t in array array['review_lesson_notes','review_lesson_note_annotations','review_lesson_note_suggestions','review_lesson_note_comments','review_lesson_note_assets','review_lesson_note_revisions','review_lesson_note_review_status','review_lesson_note_activity','review_lesson_note_notifications'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from anon,authenticated',t);
  execute format('grant select on public.%I to authenticated',t);
 end loop;
end $$;
create policy review_notes_read on public.review_lesson_notes for select to authenticated using(public.review_note_teacher(review_lesson_notes) or public.review_note_student(review_lesson_notes));
create policy review_note_annotations_read on public.review_lesson_note_annotations for select to authenticated using(public.review_note_access(note_id));
create policy review_note_suggestions_read on public.review_lesson_note_suggestions for select to authenticated using(public.review_note_access(note_id));
create policy review_note_comments_read on public.review_lesson_note_comments for select to authenticated using(public.review_note_access(note_id));
create policy review_note_assets_read on public.review_lesson_note_assets for select to authenticated using(public.review_note_access(note_id,true) or (public.review_note_access(note_id) and (state='ready' or (state='pending' and uploader_id=auth.uid()))));
create policy review_note_revisions_read on public.review_lesson_note_revisions for select to authenticated using(public.review_note_access(note_id,true));
create policy review_note_status_read on public.review_lesson_note_review_status for select to authenticated using(public.review_note_access(note_id));
create policy review_note_activity_read on public.review_lesson_note_activity for select to authenticated using(public.review_note_access(note_id,true));
create policy review_note_notifications_read on public.review_lesson_note_notifications for select to authenticated using(teacher_id=auth.uid() and public.review_note_access(note_id,true));

-- Revoke implicit PUBLIC execute, including internal definer helpers.
do $$ declare f record; begin
 for f in select p.oid::regprocedure as signature,p.proname from pg_proc p join pg_namespace ns on ns.oid=p.pronamespace where ns.nspname='public' and p.proname like 'review_note_%' loop
  execute format('revoke all on function %s from public,anon,authenticated',f.signature);
  if f.proname not in ('review_note_snapshot','review_note_event','review_note_validate_content','review_note_block','review_note_text_change') then
   execute format('grant execute on function %s to authenticated',f.signature);
  end if;
 end loop;
end $$;
notify pgrst, 'reload schema';
