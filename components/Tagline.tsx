import { createClient } from '~/util/supabase/server';
import { MdiIcon, MdiRepo, css, getEnv } from '~/util';

export default async function Tagline() {
    const supabase = createClient();
    const { data: tagline } = await supabase
        .from('flags')
        .select()
        .eq('flag', 'tagline')
        .eq('env', getEnv())
        .single();

    return (
        <small className="text-white font-semibold text-[14px]">
            <div className={css('inline', tagline.value.icon.color)}>
                <MdiIcon
                    path={MdiRepo[tagline.value.icon.type]}
                    className="inline mr-0.5"
                    size={0.8}
                />
            </div>{" "}
            <i>{tagline.value.text}</i>
        </small>
    )
}