'use client';

import { z } from 'zod';
import { useEffect } from 'react';
import { MdiIcon, css } from '~/util';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { useLocalStorage } from '@uidotdev/usehooks';
import { zodResolver } from "@hookform/resolvers/zod";
import { mdiBeaker, mdiLightningBolt } from '@mdi/js';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ExperimentState, ExperimentType, Experiments } from '~/util/experiments';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel
} from '../ui/form';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '../ui/command';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger
} from '../ui/dialog';
import { useRouter } from 'next/navigation';

const schema = z.object({
    ...Object.fromEntries(Experiments.map(experiment => [
        experiment.type,
        z.string()
    ]))
})

export const ExperimentControls: React.FC = () => {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: Object.fromEntries(Experiments.map(experiment => [
            experiment.type,
            experiment.defaultState || ''
        ]))
    });

    const [repo, save] = useLocalStorage('experiments', {} as ExperimentState);

    const updateExperiment = (type: ExperimentType, setting: string) => {
        let newRepo = { ...repo };
        newRepo[type] = setting;
        save(newRepo);
    }

    useEffect(() => {
        if (!repo) return;

        // check if any experiment types are unset, and set them to their default state
        const unsetExperiments = Object.values(ExperimentType).filter(type => !repo[type]);
        if (unsetExperiments.length > 0) {
            let newRepo = { ...repo };
            unsetExperiments.forEach(type => newRepo[type] = Experiments.find(e => e.type === type)!.defaultState || '');
            save(newRepo);
        }

        Object.entries(repo).forEach(([key, val]) => form.setValue(key, val));
    }, []);

    const onSubmit = (values: z.infer<typeof schema>) => {
        if (typeof window !== 'undefined')
            location.reload();
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="hidden md:block bg-yellow-500 hover:bg-yellow-500/70 text-white font-bold px-4 py-2 rounded-lg">
                    <MdiIcon path={mdiLightningBolt} size="18px" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-black max-w-[800px]">
                <DialogHeader>
                    <div>
                        <MdiIcon path={mdiBeaker} size={"22px"} className="inline align-text-top mr-1" />
                        Experiments
                    </div>
                </DialogHeader>
                <DialogDescription>
                    Various feature-flags and test features to aide in developing the service.
                    <br /><span className="text-red-300">Please be careful and tinker at your own risk.</span>
                </DialogDescription>
                <div className="space-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            {
                                Experiments.map(experiment => (
                                    <FormField key={experiment.type}
                                        control={form.control}
                                        name={experiment.type}
                                        defaultValue={repo[experiment.type] || experiment.defaultState || ''}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                <div className="space-y-0.5">
                                                    <FormLabel>{experiment.displayName}</FormLabel>
                                                    <FormDescription>
                                                        {experiment.description}
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    className={css(
                                                                        "w-[200px] justify-between",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {
                                                                        field.value
                                                                            ? experiment.settings.find(setting => setting.value === field.value)?.option
                                                                            : "Select treatment"
                                                                    }

                                                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[200px] p-0">
                                                            <Command>
                                                                <CommandInput placeholder="Search treatments" className="h-9" />
                                                                <CommandList>
                                                                    <CommandEmpty>No matching treatments</CommandEmpty>
                                                                    <CommandGroup>
                                                                        {
                                                                            experiment.settings.map((setting, i) => (
                                                                                <CommandItem
                                                                                    value={setting.value}
                                                                                    key={i}
                                                                                    onSelect={() => {
                                                                                        form.setValue(experiment.type, setting.value);
                                                                                        updateExperiment(experiment.type, setting.value);
                                                                                    }}
                                                                                >
                                                                                    {setting.option}
                                                                                    {experiment.defaultState === setting.value && <span className="text-xs text-blue-300 ml-1"> (default)</span>}
                                                                                    <CheckIcon
                                                                                        className={css(
                                                                                            "ml-auto h-4 w-4",
                                                                                            setting.value === field.value
                                                                                                ? "opacity-100"
                                                                                                : "opacity-0"
                                                                                        )}
                                                                                    />
                                                                                </CommandItem>
                                                                            ))
                                                                        }
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                ))
                            }

                            <div className="mt-5">
                                <Button type="submit">
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}