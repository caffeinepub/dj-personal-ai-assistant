import { useState } from "react";
import {
  useMemories,
  useAddMemory,
  useDeleteMemory,
  useCustomCommands,
  useCreateCustomCommand,
  useDeleteCommand,
  useBehaviorRules,
  useSetBehaviorRule,
  useDeleteBehaviorRule,
  useImprovementLogs,
} from "../hooks/useQueries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function SelfImprovementPanel() {
  const { data: memories = [] } = useMemories();
  const { data: commands = [] } = useCustomCommands();
  const { data: rules = [] } = useBehaviorRules();
  const { data: logs = [] } = useImprovementLogs();

  const addMemory = useAddMemory();
  const deleteMemory = useDeleteMemory();
  const createCommand = useCreateCustomCommand();
  const deleteCommand = useDeleteCommand();
  const setRule = useSetBehaviorRule();
  const deleteRule = useDeleteBehaviorRule();

  const [memoryInput, setMemoryInput] = useState("");
  const [commandName, setCommandName] = useState("");
  const [commandAction, setCommandAction] = useState("");
  const [ruleInput, setRuleInput] = useState("");

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAddMemory = async () => {
    if (!memoryInput.trim()) {
      toast.error("Please enter a memory");
      return;
    }
    try {
      await addMemory.mutateAsync(memoryInput.trim());
      setMemoryInput("");
      toast.success("Memory added successfully");
    } catch (error) {
      toast.error("Failed to add memory");
    }
  };

  const handleDeleteMemory = async (id: bigint) => {
    try {
      await deleteMemory.mutateAsync(id);
      toast.success("Memory deleted");
    } catch (error) {
      toast.error("Failed to delete memory");
    }
  };

  const handleCreateCommand = async () => {
    if (!commandName.trim() || !commandAction.trim()) {
      toast.error("Please enter command name and action");
      return;
    }
    try {
      await createCommand.mutateAsync({ name: commandName.trim(), action: commandAction.trim() });
      setCommandName("");
      setCommandAction("");
      toast.success("Command created successfully");
    } catch (error) {
      toast.error("Failed to create command");
    }
  };

  const handleDeleteCommand = async (id: bigint) => {
    try {
      await deleteCommand.mutateAsync(id);
      toast.success("Command deleted");
    } catch (error) {
      toast.error("Failed to delete command");
    }
  };

  const handleSetRule = async () => {
    if (!ruleInput.trim()) {
      toast.error("Please enter a rule");
      return;
    }
    try {
      await setRule.mutateAsync({ ruleText: ruleInput.trim(), priority: BigInt(rules.length + 1) });
      setRuleInput("");
      toast.success("Rule set successfully");
    } catch (error) {
      toast.error("Failed to set rule");
    }
  };

  const handleDeleteRule = async (id: bigint) => {
    try {
      await deleteRule.mutateAsync(id);
      toast.success("Rule deleted");
    } catch (error) {
      toast.error("Failed to delete rule");
    }
  };

  return (
    <Card className="glow-border border-primary/50">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Self-Improvement Engine</CardTitle>
        <CardDescription>
          Train DJ by adding memories, commands, and behavior rules
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="memories" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="memories">Memories</TabsTrigger>
            <TabsTrigger value="commands">Commands</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="logs">Log</TabsTrigger>
          </TabsList>

          {/* Memories Tab */}
          <TabsContent value="memories" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a new memory..."
                value={memoryInput}
                onChange={(e) => setMemoryInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddMemory()}
              />
              <Button
                onClick={handleAddMemory}
                disabled={addMemory.isPending}
                className="bg-primary"
              >
                {addMemory.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {memories.length === 0 ? (
                  <p className="text-center text-muted-foreground">No memories stored yet</p>
                ) : (
                  memories.map((memory) => (
                    <Card key={memory.id.toString()} className="border-muted">
                      <div className="flex items-start justify-between p-3">
                        <div className="flex-1">
                          <p className="text-sm">{memory.content}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatTimestamp(memory.timestamp)}
                          </p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Memory</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this memory? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteMemory(memory.id)}
                                className="bg-destructive"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Commands Tab */}
          <TabsContent value="commands" className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Command name..."
                value={commandName}
                onChange={(e) => setCommandName(e.target.value)}
              />
              <Input
                placeholder="Action description..."
                value={commandAction}
                onChange={(e) => setCommandAction(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateCommand()}
              />
              <Button
                onClick={handleCreateCommand}
                disabled={createCommand.isPending}
                className="w-full bg-primary"
              >
                {createCommand.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Command
                  </>
                )}
              </Button>
            </div>

            <ScrollArea className="h-[350px]">
              <div className="space-y-2">
                {commands.length === 0 ? (
                  <p className="text-center text-muted-foreground">No commands created yet</p>
                ) : (
                  commands.map((command) => (
                    <Card key={command.id.toString()} className="border-muted">
                      <div className="flex items-start justify-between p-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{command.name}</Badge>
                            <p className="text-xs text-muted-foreground">
                              {formatTimestamp(command.timestamp)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {command.actionDescription}
                          </p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Command</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this command?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCommand(command.id)}
                                className="bg-destructive"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a behavior rule..."
                value={ruleInput}
                onChange={(e) => setRuleInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSetRule()}
              />
              <Button onClick={handleSetRule} disabled={setRule.isPending} className="bg-primary">
                {setRule.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {rules.length === 0 ? (
                  <p className="text-center text-muted-foreground">No behavior rules set yet</p>
                ) : (
                  rules.map((rule) => (
                    <Card key={rule.id.toString()} className="border-muted">
                      <div className="flex items-start justify-between p-3">
                        <div className="flex-1">
                          <p className="text-sm">{rule.ruleText}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatTimestamp(rule.timestamp)}
                          </p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Rule</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this rule?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteRule(rule.id)}
                                className="bg-destructive"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Improvement Log Tab */}
          <TabsContent value="logs">
            <ScrollArea className="h-[450px]">
              <div className="space-y-2">
                {logs.length === 0 ? (
                  <p className="text-center text-muted-foreground">No improvements logged yet</p>
                ) : (
                  logs.map((log) => (
                    <Card
                      key={log.id.toString()}
                      className="border-l-4 border-l-primary border-muted"
                    >
                      <div className="p-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{log.entryType}</Badge>
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(log.timestamp)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm">{log.description}</p>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
